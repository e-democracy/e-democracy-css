/* vim: set expandtab tabstop=4 shiftwidth=4: */
/* concatenated to api.js on v250 code */

(function(){
        var 
        LOG_LEVEL = Math.random() < _atc.famp, // should we send diagnostic pixels?
        a = _ate,
        d = document,
        w = window,
        timeouts = {},
        _urls = {},
        _counters = {},
        _data = {};

        function _roundWithSuffix (n, amount, name) {
            n /= amount;
            n = Math.round(n*10)/10;
            if ((n+'').length > 4) n = Math.round(n);
            return n + name;
        }

        function _truncateData (data) {
            var dataLength = ('' + data).split('.').shift().length;
            if (isNaN(data)) return data;
            else if (dataLength < 4) return Math.round(data);
            else if (dataLength < 7) return _roundWithSuffix(data, 1000, "K");
            else if (dataLength < 10) return _roundWithSuffix(data, 1000000, "M");
            else return _roundWithSuffix(data, 1000000000, "B");
        }

        function _deserialize (str) {
            try {
                if (w.JSON && w.JSON.parse) {
                    return JSON.parse(str);
                }
            } catch (e) {
                return {};
            }
        }

        function _serialize (obj) {
            try {
                if (w.JSON && w.JSON.stringify) {
                    return JSON.stringify(obj);
                }
            } catch (e) {
                return '';
            }
        }

        function _getStoredCount (url) {
            var shc = _ate.cookie.rck('_atshc');
            if (shc) {
                return (_deserialize(shc) || {})[url] || -1;
            }
            return -1;
        }

        function _cleanStoredCount (url, shares) {
            var shc = _ate.cookie.rck('_atshc'), stored;
            if (shc) {
                shc = _deserialize(shc);
                stored = (shc || {})[url] || 0;

                if (stored && shares >= stored) {
                    delete shc[url];
                    _ate.cookie.sck('_atshc', _serialize(shc), 1, 1);
                }
            }
        }

        function _incrementCounter (counter) {
            var shc = _ate.cookie.rck('_atshc'), 
                newCount = _getCount(counter) + 1;
            counter.shares = newCount;
            _updateCounter(counter, _truncateData(newCount));
    
            // store sharing in cookie
            if (!shc) {
                shc = {};
            } else {
                shc = _deserialize(shc);
            }
            // store sharing in cookie
            if (shc[counter.url]) delete shc[counter.url];
            _urls[counter.url] = shc[counter.url] = newCount;
            // store sharing in cookie
            _ate.cookie.sck('_atshc', _serialize(shc), 1, 1);
        }

        function _getCount (counter) {
            var rv = 0;
            if (counter && counter.shares) {
                rv = counter.shares;
                if (isNaN(rv)) rv = 0;
            }
            return rv;
        }

        function _updateCounter (counter, content) {
            if (!counter) return;

            var isPill = counter.className.indexOf('pill_style')>-1,
                nonzero = (parseInt(content) !== 0),
                firstRender = !counter.firstChild,
                c_conf = counter.addthis_conf || {},
                c_share = counter.addthis_share || {};

            if (counter.firstChild && counter.firstChild.nodeType == 3) {
                // we can kill a textnode here, in case someone left a space or something
                counter.removeChild(counter.firstChild);
            }

            if (firstRender) {
                var exp = d.ce("a"), btn = d.ce("a"), sp = d.ce("span"), txt = d.createTextNode("Share"), backCompat = (document.compatMode == 'BackCompat'),
                    order = [], obj;

                counter.style.display = 'none';

                exp.className = "addthis_button_expanded";
                btn.className = "atc_s addthis_button_compact";
                btn.appendChild(sp); 

                if (nonzero && isPill) counter.className += ' addthis_nonzero';

                if (backCompat && _ate.bro.msi && isPill) {
                    exp.style.lineHeight= '20px';
                }

                c_conf.ui_offset_top = (_ate.bro.msi ? 0 : 20) + (_ate.bro.ffx && !backCompat ? 15 : 0);  // firefox in standards mode needs 4 more pix
                c_conf.ui_offset_left = 0; 
                c_conf.product = 'sco'+(isPill?'pl':'') + '-' + _atc.ver;

                if (isPill) order = [btn, exp];
                else order = [exp, btn];
               
                while (obj = order.shift()) counter.appendChild(obj); 

                addthis.button(btn, c_conf, c_share);
                addthis._render([exp], {conf: c_conf, share: c_share}, {nohover: true, singleservice: 'more'});
            } 
            //var a11y = d.createElement('span'),
            //count = content;
            //a11y.className = 'at_a11y';
            //a11y.innerHTML = 'Page share count ';
            //content = d.createElement('p');
            //content.className = "at_a11y_container";
            //content.appendChild(a11y);
            //content.appendChild(d.createTextNode(count));
            content = d.createTextNode(content);
            if (!isPill) {
                // remove old textnode for the actual count, if there is one
                if (counter.firstChild && counter.firstChild.firstChild) counter.firstChild.removeChild(counter.firstChild.firstChild);
                // don't show 0 counts in the pill format
                (counter.firstChild)?counter.firstChild.appendChild(content):counter.appendChild(content);
            } else {
                if (counter.firstChild && counter.firstChild.nextSibling && counter.firstChild.nextSibling.firstChild) counter.firstChild.nextSibling.removeChild(counter.firstChild.nextSibling.firstChild);
                if (!nonzero) {
                    if (counter.className) counter.className = counter.className.replace(/addthis_nonzero/g,'');
                } else {
                    if (counter.className.indexOf('addthis_nonzero') == -1) counter.className += ' addthis_nonzero';
                    counter.firstChild.nextSibling.appendChild(content);
                }
            }

            // re: #20710; if we wanted to change this
            //if (_ate.bro.ie6 || _ate.bro.ie7 || _ate.bro.ff2 || _ate.bro.opr) counter.style.display = 'block';
            //else counter.style.display = 'inline-block';
            counter.style.display = 'block';
            counter.href = '#';
        }

        function _renderShareCounter (counter, shares) {
            counter.shares = shares;
            _updateCounter(counter, _truncateData(shares));
        }

        function _recvCounterData (counter, data, callback, passthrough /* send full response to callback */) {
            var shares = 0,
                stored = _getStoredCount(counter.url);
    
            if (data.error) {
                shares = "?";
            } else {
                shares = data.shares;
            }
            if (!isNaN(stored) && ((isNaN(shares) && stored > 0) || stored > shares)) {
                shares = stored;
            } else {
                // if we had legitimate stored or returned shares, we can clean the count
                _cleanStoredCount(counter.url, shares);
            }

            if (!_urls[counter.url]) _urls[counter.url] = shares;

            if (passthrough) callback(counter, data);
            else callback(counter, shares);
        }

        function _getShareCount(url, callback) {
            if (!url) callback({error: {message:'no url provided', code:-10}});
            if (_data[url]) callback(_data[url]);
            
            var counterUrl = url,
                cbname = _ate.util.scb('sc', url, function (data) {
                        if (LOG_LEVEL) {
                            var execTime = ((new Date()).getTime() - _ate.cbs['time_'+cbname]),
                                img = new Image();
                            a.imgz.push(img);
                            img.src = '//m.addthisedge.com/live/t00/mu.gif?a=sc&r='+(1/LOG_LEVEL)+'&'+(isNaN(execTime)?'err=1':'t='+execTime);
                        }
                        if (!data.url) data.url = url;
                        _data[url] = data;
                        callback(_data[url]);
                    }, /* timeout function, called 10s after load */ function () { 
                        _data[url] = {error: {message:'server timed out',code:999}};
                        callback(_data[url]);
                }); //, true /* no cache bust */

            /* should lowercase domain, per #19626*/ 
            counterUrl = a.util.gUD(url).toLowerCase() + a.util.gUQS(url);
            
            // load jsonp
            _ate.ajs('//api-public.addthis.com/url/shares.json?url='+_euc(counterUrl)+'&callback='+cbname, 1);
        }
        function _reqCounterData (counter, callback, passthrough) {
            var stored = _getStoredCount(counter.url),
                url = counter.url;
            
            // @todo only need to do this once per page? - phase 1, yes
            if (!_counters[url]) _counters[url] = [];
            _counters[url].push(counter);

            // always add the share event listener, for dynamic updates
            _ate.ed.addEventListener('addthis.menu.share', function (e) {
                try {
                    if (e.data.service && _ate.track.mgu(e.data.url, {clean:1,defrag:1}) == url) {
                        if (e.data.service == 'facebook_unlike' || (_atc.ver >= 300 && (e.data.service == 'more' || e.data.service == 'email')) || e.data.service == 'google_unplusone') return;
                        _incrementCounter(counter);
                    }
                } catch (e) {
                }
            });

            if (_urls[url] !== undefined) {
                // can callback immediately with loaded data
                callback(counter, _urls[url]);
            } else if (url) {
                // load stored value first (which will get replaced if the webservice actually returns)
                if (!isNaN(stored) && stored > 0) callback(counter, stored);
                _ate.track.apc('sco'+(counter.className.indexOf('pill_style') > -1 ? 'pl' : '')+'-'+_atc.ver);

                // if there's another counter waiting on the same url, we can skip creating a callback
                if (_counters[url].length > 1) return; 

                _getShareCount(url, function (data) {
                    if (data && !data.error && data.shares) _urls[url] = data.shares;

                    if (_counters[url]) {
                        for (var i = 0; i < _counters[url].length; i++) {
                            _recvCounterData(_counters[url][i], data, callback);
                        }
                    }
                });
            }
        }

        function _prepShareCounter (what, config, share) {
            if (what) {
                what = _ate.util.select(what);

                for (var i = 0; i < what.length; i++) {
                    var counter = what[i],
                        p_attrs = ((counter.parentNode || {}).className || '').indexOf('addthis_toolbox') > -1 ? addthis.util.getAttributes(counter.parentNode, config, share) 
                                  : ((((counter.parentNode || {}).parentNode || {}).className || '').indexOf('addthis_toolbox') > -1 ? addthis.util.getAttributes(counter.parentNode.parentNode, config, share) : null),
                        attrs = addthis.util.getAttributes(counter, p_attrs ? p_attrs.conf : config, p_attrs ? p_attrs.share : share, true); 
                    if (!counter.ost) {
                        if (counter.className.indexOf('addthis_counter') == -1) counter.className += ' addthis_counter';
                        if (_ate.bro.ie6 && counter.className.indexOf('compatmode') == -1) counter.className += ((counter.className.indexOf('bubble_style')>-1)?' bubble':' ')+'compatmode'+_ate.bro.mod;

                        if (_ate.bro.ie6 && counter.className.indexOf('ie6') == -1) counter.className += ' ie6';
                        else if (_ate.bro.ie7 && counter.className.indexOf('ie7') == -1) counter.className += ' ie7';
                        counter.url = (share || attrs.share || w.addthis_share || {}).trackurl || _ate.track.mgu((share || {}).url || attrs.share.url || (w.addthis_share || {}).url, {clean:1,defrag:1});
                        counter.addthis_conf = attrs.conf;
                        counter.addthis_share = attrs.share;
                        counter.ost = 1;
                        //_updateCounter(counter, "--");  
                        _reqCounterData(counter, function (counter, data) { _renderShareCounter(counter, data); });
                    }
                }
            }
        }

        
    function addCounter(what, config, share) { 
        _prepShareCounter(what, config, share);
    }
        
    function addCount(what, config, share) { 
        if (what) {
            what = _ate.util.select(what);
            for (var i = 0; i < what.length; i++) {
                var count = what[i],
                    p_attrs = ((count.parentNode || {}).className || '').indexOf('addthis_toolbox') > -1 ? addthis.util.getAttributes(count.parentNode, config, share) : null,
                    attrs = addthis.util.getAttributes(count, p_attrs ? p_attrs.conf : config, p_attrs ? p_attrs.share : share, true); 
                if (!count.ost) {
                    count.url = (share || attrs.share || w.addthis_share || {}).trackurl || _ate.track.mgu((share || {}).url || attrs.share.url || (w.addthis_share || {}).url, {clean:1,defrag:1});
                    count.addthis_conf = attrs.conf;
                    count.addthis_share = attrs.share;
                    count.ost = 1;
                    _getShareCount(count.url, function (data) {
                        count.innerHTML = data.error ? '?' : data.shares;
                    });
                }
            }
        }
    }

    function onReady() {
        addthis.count = addCount;
        addthis.counter = addCounter;
        addthis.data.getShareCount = function (callback, share) {
            if (!share) share = addthis_share;
            _getShareCount(typeof(share) == 'string' ? share : share.trackurl || share.url, callback);
        }

        addthis.count.ost = 1;
        addthis.counter.ost = 1;
    }

    if (_adr.isReady) {
        onReady();
        return addCounter;
    } else {
        addthis.addEventListener('addthis.ready', onReady);
        return addthis;
    }
})();

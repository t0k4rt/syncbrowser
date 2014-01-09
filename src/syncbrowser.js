(function(window, document, Mousetrap, $, undefined) {
    var Syncbrowser = {
        sync : function (host, namespace) {


            if(typeof host == 'undefined') {
                host = 'http://localhost';
            }

            if(typeof namespace == 'undefined') {
                namespace = 'syncbrowser';
            }

            var socket = io.connect(
                host,
                {
                    port: 80
                }
            );
            var master;


            //
            // Managing master
            // _____________


            // if the document has focus, this browser should probably be the master
            // todo issue : a document can have focus even if the window is not selected
            if(document.hasFocus()) {
                socket.on('connect', function () {
                    master = socket.socket.sessionid;
                    socket.emit('signaling', {namespace: namespace, master: master});
                });
            }

            // we send and received events only when we are connected
            socket.on('connect', function () {
                console.log('connection established');

                //A browser can take ownership in different cases :
                // * on docus
                // * on click on the document
                // * on touch on a smartphone /tablet
                $(window).on('blur focus click touchstart', function(e) {
                    /*var prevType = $(this).data('prevType');

                     if (prevType != e.type) {   //  reduce double fire issues
                     */
                    switch (e.type) {
                        case 'blur':
                            break;
                        case 'focus':
                            master = socket.socket.sessionid;
                            socket.emit('signaling', {namespace: namespace, master: master});
                            break;
                        case 'click':
                            master = socket.socket.sessionid;
                            socket.emit('signaling', {namespace: namespace, master: master});
                            break;
                        case 'touchstart':
                            master = socket.socket.sessionid;
                            socket.emit('signaling', {namespace: namespace, master: master});
                            break;
                    }
                    /*}
                     $(this).data('prevType', e.type);*/
                });


                // we use signaling to tell other browsers who's the boss
                socket.on('signaling', function (data) {
                    if(data.namespace == namespace) {
                        master = data.master;
                    }
                });

                //
                // Received Events
                // _____________


                // browser react when it receive events
                // list of supported events are right now :
                // * scroll
                // * click on links
                // * reload when using cmd+r / ctrl+r
                socket.on('event', function (data) {
                    console.log('data received : ',data);
                    if(master != socket.socket.sessionid && master == data.id && data.namespace == namespace) {
                        console.log('data comes from master browser');

                        if(data.event.type == 'scroll') {
                            var newYpos = ($('html').height() - $(window).height()) * data.event.ypos;
                            $(window).scrollTop(newYpos);
                        }

                        if(data.event.type == 'click') {
                            document.location = data.event.url;
                        }

                        if(data.event.type == 'reload') {
                            document.location = document.location;
                        }
                    }
                });



                //
                // Sent Events
                // _____________

                // we send scroll events only if we are master to avoid conflicts
                $(window).on('scroll', function() {
                    if(master == socket.socket.sessionid) {
                        var percentage = $(window).scrollTop() / ($('html').height() - $(window).height());
                        socket.emit('event', {namespace: namespace, event: {type: 'scroll', ypos: percentage}});
                    }
                });


                // we react to cmd+r / ctrl+r keyboard events to reload on multiple browsers
                Mousetrap.bind(['command+r', 'ctrl+r'], function(e){
                    e.preventDefault();
                    console.log('reload');
                    socket.emit('event', {namespace: namespace, event: {type: 'reload'}});
                    document.location = document.location;
                });


                // we send click events when clicking on links
                $(document).click(function(e) {
                    console.log('clicked : ', e.target.nodeName);
                    if(e.target.nodeName == 'A') {
                        //console.log(e.target.href);
                        socket.emit('event', {namespace: namespace, event: {type: 'click', url: e.target.href}});
                    }

                    //manage img with a link
                    if(e.target.nodeName == 'IMG') {
                        var node = e.target.parentNode;

                        if(node.nodeName == 'A') {
                            socket.emit('event', {namespace: namespace, event: {type: 'click', url: node.href}});
                        }
                    }
                });
            });


            //todo : sync interface interactions (eg : history, reload button etc.)
        }
    };


    // expose Syncbrowser to the global object
    window.Syncbrowser = Syncbrowser;

    // expose Syncbrowser as an AMD module
    if (typeof define === 'function' && define.amd) {
        define(Syncbrowser);
    }

}) (window, document, Mousetrap, jQuery);


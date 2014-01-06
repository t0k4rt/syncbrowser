(function(window, document, Mousetrap, $, undefined) {
    var Syncbrowser = {
        sync : function (address, namespace) {


            if(typeof address == 'undefined') {
                address = 'http://localhost';
            }

            if(typeof namespace == 'undefined') {
                namespace = 'syncbrowser';
            }

            var socket = io.connect(address);
            var master;

            // if the document has focus, this browser should probably be the master
            if(document.hasFocus()) {
                socket.on('connect', function () {
                    master = socket.socket.sessionid;
                    socket.emit('signaling', {namespace: namespace, master: master});
                });
            }

            // we send and received events only when we are connected
            socket.on('connect', function () {
                console.log('connection established');

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


                //todo : finish here
                socket.on('signaling', function (data) {
                    if(data.namespace == namespace) {
                        master = data.master;
                    }
                });

                socket.on('event', function (data) {
                    console.log('data received : ',data);
                    //todo : finish here
                    if(master != socket.socket.sessionid && master == data.id && data.namespace == namespace) {
                        console.log('data comes from master browser');

                        if(data.event.type == 'scroll') {
                            var newYpos = ($('html').height() - $(window).height()) * data.event.ypos;
                            //console.log(newYpos);
                            $(window).scrollTop(newYpos);
                        }

                        if(data.event.type == 'click') {
                            document.location = data.event.url;
                        }

                        if(data.event.type == 'hashchange') {
                            document.location = data.event.newURL;
                        }

                        if(data.event.type == 'reload') {
                            document.location = document.location;
                        }
                    }
                });

                $(window).on('scroll', function() {
                    if(master == socket.socket.sessionid) {
                        var percentage = $(window).scrollTop() / ($('html').height() - $(window).height());
                        socket.emit('event', {namespace: namespace, event: {type: 'scroll', ypos: percentage}});
                    }
                });

                /*$(window).on('load', function() {
                 //todo : finish here
                 if(master) {
                 socket.emit('event', {namespace: namespace, event: {type: 'reload'}});
                 }
                 });*/

                Mousetrap.bind(['command+r', 'ctrl+r'], function(e){
                    e.preventDefault();
                    console.log('reload');
                    socket.emit('event', {namespace: namespace, event: {type: 'reload'}});
                    document.location = document.location;
                });

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


            // should try to find a way to sync browser history.
            /*$(window).on('unload', function(event) {
             event.preventDefault();
             console.log(event);
             //socket.emit('event', {master: socket.socket.sessionid, event: {type: 'hashchange', newURL: event.newURL}});
             })*/

        }
    };


    // expose mousetrap to the global object
    window.Syncbrowser = Syncbrowser;

    // expose mousetrap as an AMD module
    if (typeof define === 'function' && define.amd) {
        define(Syncbrowser);
    }
}) (window, document, Mousetrap, jQuery);

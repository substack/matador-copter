module.exports = function (client) {
  var ctrl = {
    f: client.front,
    t: client.counterClockwise,
    a: client.up,
    s: client.left,
  }

  var cmd = {
    left:         function (n) { ctrl.t(n)  },
    right:        function (n) { ctrl.t(-1 * n) },

    shift_left:   function (n) { ctrl.t(.5 * n)  },
    shift_right:  function (n) { ctrl.t(-0.5 * n) },

    up:           function (n) { ctrl.f(1 * n)  },
    down:         function (n) { ctrl.f(-1 * n) },

    ',':          function (n) { ctrl.s(-1 * n)  },
    '.':          function (n) { ctrl.s(1 * n)  },

    shift_up:     function (n) { ctrl.a(1 * n)  },
    shift_down:   function (n) { ctrl.a(-1 * n) },

    shift_t:      function (n) {
        client.disableEmergency()
        client.takeoff(1 * n)
    },
    shift_l:      function (n) { client.land(1 * n) },

    f:            function (n) { if (n) client.animate('flipLeft', 15) },

  }

  window.addEventListener('keydown', function (ev) {
    var c = commandOf(ev)
    if (c) c(1)
  })
  
  window.addEventListener('keyup', function (ev) {
    var c = commandOf(ev)
    if (c) c(0)
  })

  function commandOf (ev) {
    var name = ev.keyIdentifier.toLowerCase()
    var meta = ev.shiftKey ? 'shift_' : ''
    return cmd[meta + name]
        || cmd[meta + String.fromCharCode(ev.keyCode).toLowerCase()]
  }
}

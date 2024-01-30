'use strict';
'require view';
'require form';
'require rpc';

var callLeds = rpc.declare({
        object: 'luci',
        method: 'getLEDs',
        expect: { '': {} }
});

// Project code format is tabs, not spaces
return view.extend({
        load: function() {
                return Promise.all([
                        callLeds(), 
                ]).then(function(data) {
                        var value = {};
                        value[0] = data[0];
                        return value;
                });
        },
	render: function(data) {
		var m, s, o;
                var leds = data[0];

		/*
		The first argument to form.Map() maps to the configuration file available
		via uci at /etc/config/. In this case, 'netwatch' maps to /etc/config/netwatch.

		If the file is completely empty, the form sections will indicate that the
		section contains no values yet. As such, your package installation (LuCI app
		or software that the app configures) should lay down a basic configuration
		file with all the needed sections.

		The relevant ACL path for reading a configuration with UCI this way is
		read > uci > ["netwatch"]

		The relevant ACL path for writing back the configuration is
		write > uci > ["netwatch"]
		*/
		m = new form.Map('netwatch', _('Netwatch Configuration'),
			_('Netwatch Configuration Settings.'));

		s = m.section(form.TypedSection, 'server', _('Server Section'));
		s.anonymous = true;

		o = s.option(form.Value, "remote1", _("Remote Server"),
			_('IP address of remote server to ping') + '<br/>'
		)
		o.rmempty = false;
		o.datatype = "minlength(1)";

		o = s.option(form.Value, "remote2", _("Secondary Remote Server"),
			_('IP address of secondary remote server to ping') + '<br/>' +
			_('Pinged if primary server fails') + '<br/>'
		)
		o.rmempty = false;
		o.datatype = "minlength(1)";

		s = m.section(form.TypedSection, 'led', _('LED Section'));
		s.anonymous = true;

		o = s.option(form.ListValue, 'led', _('Select LED'),
			_('Select the LED that will flash'));
		o.placeholder = 'placeholder';
                o.select_placeholder = _('-none-');
                o.value('none:none:none', _('-none-'));
                Object.keys(leds).sort().forEach(function(name) {
                    o.value(name);
                });
		o.rmempty = false;
		o.editable = true;

		return m.render();
	},
});

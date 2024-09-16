import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';

const { St, Clutter, Gio, GLib, Soup } = imports.gi;

function getBitcoinPrice() {
  return new Promise((resolve) => {
    let url = 'https://api.coindesk.com/v1/bpi/currentprice/BTC.json'
    let session = new Soup.Session();
    let message = Soup.Message.new('GET', url);

    session.send_and_read_async(message, 0, null, function (session, result) {
      if (message.get_status() === 200) {
        let bytes = session.send_and_read_finish(result);
        let response = new TextDecoder('utf-8').decode(bytes.get_data());
        resolve({
          code: result.status_code,
          body: JSON.parse(response),
        });
      }
    });
  });
}

export default class BitmonitorExtension extends Extension {
  constructor(uuid, metadata) {
    super(uuid, metadata);
  }

  enable() {
    const bitcoinIconPath = GLib.build_filenamev([this.path, 'assets', 'bitcoin.png']);

    const icon = new St.Icon({
      gicon: new Gio.FileIcon({ file: Gio.File.new_for_path(bitcoinIconPath) }),
      style_class: 'bitmonitor-icon'
    });

    const label = new St.Label({
      text: "",
      y_align: Clutter.ActorAlign.CENTER,
      style_class: 'bitmonitor-label'
    });

    const box = new St.BoxLayout({
      vertical: false,
      style_class: 'bitmonitor-box'
    });

    box.add_child(icon);
    box.add_child(label);

    this.button = new PanelMenu.Button(0.0, 'bitmonitor');

    this.button.add_child(box);

    Main.panel.addToStatusArea('bitmonitor', this.button, 0, 'right');

    const updateBitcoinPrice = async () => {
      let bitcoinPrice = (await getBitcoinPrice()).body.bpi.USD.rate_float;
      console.log(_('Bitcoin price: %d $').format(bitcoinPrice));
      label.text = ": %d $".format(bitcoinPrice);
    }
    setInterval(updateBitcoinPrice, 10000);
  }

  disable() {
    if (this.button) {
      this.button.destroy();
      this.button = null;
    }
  }
}

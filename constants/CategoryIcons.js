import React from 'react';
import { Icon } from 'react-native-elements';

const handler = {
  get: function(target, name) {
    return target.hasOwnProperty(name) ?
      <Icon
        name={target[name][0]}
        type={target[name][1]}
      /> :
      <Icon
        name="web"
        type="foundation"
      />;
  }
};

const categoryIconsObj = {
  "General Software Development": ["code", "entypo"],
  "General Business": ["business-center", "material"],
  "General Utilities": ["wrench", "font-awesome"],
  "Engineering & Technology": ["gears", "font-awesome"],
  "Editing & IDEs": ["codesquare", "antdesign"],
  "Uncategorized": ["web", "foundation"],
  "Customer Relations": ["customerservice", "antdesign"],
  "Business & Finance": ["money", "font-awesome"],
  "General Software": ["monitor", "foundation"],
  "Society": ["group", "font-awesome"],
  "Systems Operations": ["harddisk", "material-community"],
  "Writing": ["pencil", "font-awesome"],
  "General News & Opinion": ["newspaper-o", "font-awesome"],
  "General Social Networking": ["network", "entypo"],
  "Browsers": ["browser", "entypo"],
  "Email": ["email", "material-community"],
  "International": ["earth", "material-community"],
  "Intelligence": ["brain", "material-community"],
  "Search": ["magnifying-glass", "foundation"],
  "General Reference & Learning": ["book", "entypo"],
  "Games": ["controller-classic", "material-community"],
  "Business": ["briefcase", "entypo"],
  "General Entertainment": ["popcorn", "material-community"],
  "Video": ["video", "entypo"],
};

export const categoryIcons = new Proxy(categoryIconsObj, handler);

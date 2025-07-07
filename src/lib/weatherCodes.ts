export interface WeatherCodeInfo {
    day: {
        emoji: string;
        text: string;
    };
    night: {
        emoji: string;
        text: string;
    };
}

export const weatherCodes: Record<string, WeatherCodeInfo> = {
    "1000": { day: { text: "Saulains", emoji: "☀️" }, night: { text: "Skaidrs", emoji: "🌙" } },
    "1003": { day: { text: "Daļēji mākoņains", emoji: "🌤️" }, night: { text: "Daļēji mākoņains", emoji: "🌤️" } },
    "1006": { day: { text: "Mākoņains", emoji: "☁️" }, night: { text: "Mākoņains", emoji: "☁️" } },
    "1009": { day: { text: "Apbrāzies", emoji: "☁️" }, night: { text: "Apbrāzies", emoji: "☁️" } },
    "1030": { day: { text: "Miglains", emoji: "🌫️" }, night: { text: "Miglains", emoji: "🌫️" } },
    "1063": { day: { text: "Iespējams īslaicīgs lietus", emoji: "🌦️" }, night: { text: "Iespējams īslaicīgs lietus", emoji: "🌦️" } },
    "1066": { day: { text: "Iespējams īslaicīgs sniegs", emoji: "🌨️" }, night: { text: "Iespējams īslaicīgs sniegs", emoji: "🌨️" } },
    "1069": { day: { text: "Iespējams īslaicīgs slapjš sniegs", emoji: "🌨️" }, night: { text: "Iespējams īslaicīgs slapjš sniegs", emoji: "🌨️" } },
    "1072": { day: { text: "Iespējams īslaicīga sasalstoša atkusnis", emoji: "🌧️" }, night: { text: "Iespējams īslaicīga sasalstoša atkusnis", emoji: "🌧️" } },
    "1087": { day: { text: "Iespējami pērkona negaisi", emoji: "⛈️" }, night: { text: "Iespējami pērkona negaisi", emoji: "⛈️" } },
    "1114": { day: { text: "Pūš sniegs", emoji: "🌨️" }, night: { text: "Pūš sniegs", emoji: "🌨️" } },
    "1117": { day: { text: "Sniega vētra", emoji: "🌨️" }, night: { text: "Sniega vētra", emoji: "🌨️" } },
    "1135": { day: { text: "Migla", emoji: "🌫️" }, night: { text: "Migla", emoji: "🌫️" } },
    "1147": { day: { text: "Sasalstoša migla", emoji: "🌫️" }, night: { text: "Sasalstoša migla", emoji: "🌫️" } },
    "1150": { day: { text: "Īslaicīgs smidzinošs lietus", emoji: "🌧️" }, night: { text: "Īslaicīgs smidzinošs lietus", emoji: "🌧️" } },
    "1153": { day: { text: "Smidzinošs lietus", emoji: "🌧️" }, night: { text: "Smidzinošs lietus", emoji: "🌧️" } },
    "1168": { day: { text: "Sasalstošs smidzinošs lietus", emoji: "🌧️" }, night: { text: "Sasalstošs smidzinošs lietus", emoji: "🌧️" } },
    "1171": { day: { text: "Sārmains smidzinošs lietus", emoji: "🌧️" }, night: { text: "Sārmains smidzinošs lietus", emoji: "🌧️" } },
    "1180": { day: { text: "Īslaicīgs neliels lietus", emoji: "🌦️" }, night: { text: "Īslaicīgs neliels lietus", emoji: "🌦️" } },
    "1183": { day: { text: "Neliels lietus", emoji: "🌧️" }, night: { text: "Neliels lietus", emoji: "🌧️" } },
    "1186": { day: { text: "Laiku pa laikam mērens lietus", emoji: "🌦️" }, night: { text: "Laiku pa laikam mērens lietus", emoji: "🌦️" } },
    "1189": { day: { text: "Mērens lietus", emoji: "🌧️" }, night: { text: "Mērens lietus", emoji: "🌧️" } },
    "1192": { day: { text: "Laiku pa laikam stiprs lietus", emoji: "🌧️" }, night: { text: "Laiku pa laikam stiprs lietus", emoji: "🌧️" } },
    "1195": { day: { text: "Stiprs lietus", emoji: "🌧️" }, night: { text: "Stiprs lietus", emoji: "🌧️" } },
    "1198": { day: { text: "Neliels sasalstošs lietus", emoji: "🌧️" }, night: { text: "Neliels sasalstošs lietus", emoji: "🌧️" } },
    "1201": { day: { text: "Mērens vai stiprs sasalstošs lietus", emoji: "🌧️" }, night: { text: "Mērens vai stiprs sasalstošs lietus", emoji: "🌧️" } },
    "1204": { day: { text: "Neliels slapjš sniegs", emoji: "🌨️" }, night: { text: "Neliels slapjš sniegs", emoji: "🌨️" } },
    "1207": { day: { text: "Mērens vai stiprs slapjš sniegs", emoji: "🌨️" }, night: { text: "Mērens vai stiprs slapjš sniegs", emoji: "🌨️" } },
    "1210": { day: { text: "Īslaicīgs neliels sniegs", emoji: "🌨️" }, night: { text: "Īslaicīgs neliels sniegs", emoji: "🌨️" } },
    "1213": { day: { text: "Neliels sniegs", emoji: "🌨️" }, night: { text: "Neliels sniegs", emoji: "🌨️" } },
    "1216": { day: { text: "Īslaicīgs mērens sniegs", emoji: "🌨️" }, night: { text: "Īslaicīgs mērens sniegs", emoji: "🌨️" } },
    "1219": { day: { text: "Mērens sniegs", emoji: "🌨️" }, night: { text: "Mērens sniegs", emoji: "🌨️" } },
    "1222": { day: { text: "Īslaicīgs stiprs sniegs", emoji: "🌨️" }, night: { text: "Īslaicīgs stiprs sniegs", emoji: "🌨️" } },
    "1225": { day: { text: "Stiprs sniegs", emoji: "🌨️" }, night: { text: "Stiprs sniegs", emoji: "🌨️" } },
    "1237": { day: { text: "Ledus graudi", emoji: "🧊" }, night: { text: "Ledus graudi", emoji: "🧊" } },
    "1240": { day: { text: "Īslaicīgs neliels lietus", emoji: "🌦️" }, night: { text: "Īslaicīgs neliels lietus", emoji: "🌦️" } },
    "1243": { day: { text: "Mērens vai stiprs lietus", emoji: "🌧️" }, night: { text: "Mērens vai stiprs lietus", emoji: "🌧️" } },
    "1246": { day: { text: "Plūdu lietus", emoji: "🌧️" }, night: { text: "Plūdu lietus", emoji: "🌧️" } },
    "1249": { day: { text: "Īslaicīgs neliels slapjš sniegs", emoji: "🌨️" }, night: { text: "Īslaicīgs neliels slapjš sniegs", emoji: "🌨️" } },
    "1252": { day: { text: "Mērens vai stiprs slapjš sniegs", emoji: "🌨️" }, night: { text: "Mērens vai stiprs slapjš sniegs", emoji: "🌨️" } },
    "1255": { day: { text: "Īslaicīgs neliels sniegs", emoji: "🌨️" }, night: { text: "Īslaicīgs neliels sniegs", emoji: "🌨️" } },
    "1258": { day: { text: "Mērens vai stiprs sniegs", emoji: "🌨️" }, night: { text: "Mērens vai stiprs sniegs", emoji: "🌨️" } },
    "1261": { day: { text: "Īslaicīgi nelieli ledus graudi", emoji: "🧊" }, night: { text: "Īslaicīgi nelieli ledus graudi", emoji: "🧊" } },
    "1264": { day: { text: "Mēreni vai stipri ledus graudu lietusgāzes", emoji: "🧊" }, night: { text: "Mēreni vai stipri ledus graudu lietusgāzes", emoji: "🧊" } },
    "1273": { day: { text: "Īslaicīgs neliels lietus ar pērkona negaisu", emoji: "⛈️" }, night: { text: "Īslaicīgs neliels lietus ar pērkona negaisu", emoji: "⛈️" } },
    "1276": { day: { text: "Mērens vai stiprs lietus ar pērkona negaisu", emoji: "⛈️" }, night: { text: "Mērens vai stiprs lietus ar pērkona negaisu", emoji: "⛈️" } },
    "1279": { day: { text: "Īslaicīgs neliels sniegs ar pērkona negaisu", emoji: "⛈️" }, night: { text: "Īslaicīgs neliels sniegs ar pērkona negaisu", emoji: "⛈️" } },
    "1282": { day: { text: "Mērens vai stiprs sniegs ar pērkona negaisu", emoji: "⛈️" }, night: { text: "Mērens vai stiprs sniegs ar pērkona negaisu", emoji: "⛈️" } }
}

const forge = require('node-forge');
const crypto = require('crypto');
const request = require('sync-request');
 
var md5Hash = function (input) {
    const hash = crypto.createHash('md5');
    hash.update(input);
    return hash.digest('hex');
}
 
var g = function (e, t) {
    return "".concat(e).concat(t)
};
 
var d = function () {
    for (var e = S().replace(/-/g, ""), t = "", r = 0; r < 32; r++) t += "".concat(e[r]).concat("0fd428b6a9fc4049bf78e31769ac97f6" [r]);
    return t
};
 
var S = function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (function (e) {
        var t = 16 * Math.random() | 0;
        return ("x" == e ? t : 3 & t | 8).toString(16)
    }))
};
 
var encrypt = function (t) {
var r = "-----BEGIN PUBLIC KE",
        o = forge.util.encodeUtf8(t),
        n = forge.pki.publicKeyFromPem(r);
    return forge.util.encode64(n.encrypt(o, "RSA-OAEP", {
        md: forge.md.sha256.create(),
        mgf1: {
            md: forge.md.sha1.create()
        }
    }))
};
 
var makeConfig = function (e) {
    e.header["X-Channel"] = "02";
    e.header["Sign-Chnl"] = "02";
    e.header["CO-MD"] = d();
    e.header['Authorization'] = "";
    e.header['empeNm'] = "";
    if (e.data && !e.header["X-MD"]) {
        for (var T = 115, O = "string" == typeof e.data ? encodeURIComponent(e.data) : encodeURIComponent(JSON.stringify(e.data)), A = [], D = 0; D < O.length / T; D++) {
            var N = D * T;
            A.push(encrypt(O.substring(N, N + T)))
        }
        e.data = {
            rsa: A
        }, e.header["X-MD"] = md5Hash(A.join(""))
    };
    e.params && !e.params.rsa && (e.params = {
        rsa: encrypt("string" == typeof e.params ? encodeURIComponent(e.params) : encodeURIComponent(JSON.stringify(e.params)))
    })
    var w = 0,
        l = (new Date).getTime();
    l += w;
    var v = encrypt("".concat(S(), ",").concat(l));
    e.header["C-RS"] = v, e.header["C-MD"] = md5Hash(v);
    e.header["V-MD"] = md5Hash(g("string" == typeof e.data ? e.data : JSON.stringify(e.data), e.header.Authorization || ""))
}
 
var req = {
    data: {
        
    },
    header: {
        "Referer": "",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac",
        "If-Modified-Since": "0",
    }
}
makeConfig(req)
// console.log(req)
var res = request('POST', '', {
    headers: req.header,
    json: req.data
});
// console.log(req)
console.log(JSON.parse(res.getBody('utf8')));

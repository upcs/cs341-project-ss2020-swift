"use strict";

module.exports.rawQuery = "SELECT ??, stat_id, invert_flag, stat_name_short, units FROM stats3 WHERE stat_id IN (?)";

module.exports.states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI",
"ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
"MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR",
"PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

module.exports.cats = "SELECT stat_id, stat_name_short FROM stats3";

module.exports.metadata = "SELECT * FROM metadata3";

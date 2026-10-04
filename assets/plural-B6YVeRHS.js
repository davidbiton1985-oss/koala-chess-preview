const r=new Map;function s(o,e){let t=r.get(e);t||(t=new Intl.PluralRules(e),r.set(e,t));const n=t.select(o);return n==="one"?"one":n==="two"?"two":"other"}export{s as p};

import{a as g,i as a,S as L}from"./assets/vendor-2257b9f6.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function i(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(e){if(e.ep)return;e.ep=!0;const r=i(e);fetch(e.href,r)}})();g.defaults.baseURL="https://pixabay.com/api/";const v="34523545-f21683fd59bfc3e4e2549fe07";async function m(o,t,i){const{data:n}=await g.get(`?key=${v}&q=${o}&image_type=photo&orientation=horizontal&safesearch=true&page=${t}&per_page=${i}`);return n}const $=document.querySelector(".gallery");function h(o){const t=o.map(({webformatURL:i,largeImageURL:n,tags:e,likes:r,views:s,comments:b,downloads:w})=>`
      <li class="photo-card">
        <a href="${n}">
          <img class="photo-img" src="${i}" alt="${e}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b>${r}</p>
          <p class="info-item"><b>Views</b>${s}</p>
          <p class="info-item"><b>Comments</b>${b}</p>
          <p class="info-item"><b>Downloads</b>${w}</p>
        </div>
      </li>`).join("");$.insertAdjacentHTML("beforeend",t)}const S=document.querySelector(".search-form"),p=document.querySelector(".gallery");let l="",c=1,y;const f=40;let u=!1;S.addEventListener("submit",E);window.addEventListener("scroll",d);async function E(o){o.preventDefault();const t=o.currentTarget.searchQuery.value.trim();if(t===l){a.info({title:"Info",message:`The previous ${l} request has already been received, please enter a new search parameter.`,position:"topRight",color:"blue"});return}if(p.innerHTML="",!t){a.warning({title:"Warning",message:"Please, fill the main field",position:"topRight",color:"yellow"});return}l=t,c=1,p.innerHTML="";try{const{hits:i,totalHits:n}=await m(l,c,f);if(n===0){a.error({title:"Error",message:"Sorry, there are no images matching your search query. Please try again.",position:"topRight",color:"red"});return}h(i),y=new L(".gallery a").refresh(),a.success({title:"Success",message:`Hooray! We found ${n} images !!!`,position:"topRight",color:"green"})}catch(i){console.log(i)}finally{window.addEventListener("scroll",d)}}async function d(){if(P()&&!u){u=!0,c+=1;try{const{hits:o,totalHits:t}=await m(l,c,f);h(o),y.refresh();const i=Math.ceil(t/f);c>=i&&(a.info({title:"Info",message:"We're sorry, but you've reached the end of search results.",position:"topRight",color:"blue"}),window.removeEventListener("scroll",d))}catch(o){console.log(o)}finally{u=!1}}}function P(){return window.innerHeight+window.scrollY>=document.documentElement.scrollHeight}
//# sourceMappingURL=commonHelpers.js.map

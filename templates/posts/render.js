/* 讀上面 <script id="data"> 的 JSON，把字和照片填進版型。
   AI 只需要改 JSON，不用改 HTML／CSS：輸出很短，免費模型也跑得快。 */
(function(){
  const data = JSON.parse(document.getElementById("data").textContent);
  const get = (obj, path) => path.split(".").reduce((o,k) => (o == null ? o : o[k]), obj);
  function fill(root, obj){
    root.querySelectorAll("[data-k]").forEach(el => {
      const v = get(obj, el.dataset.k);
      if (el.tagName === "IMG") {
        const box = el.closest(".photo");
        if (v) { el.src = v; box && box.classList.remove("noimg"); }
        else { box && box.classList.add("noimg"); }
      } else if (v == null || v === "") { if (el.dataset.optional !== undefined) el.remove(); }
      else el.textContent = v;
    });
    root.querySelectorAll("[data-list]").forEach(list => {
      const tpl = list.querySelector("template"); const items = get(obj, list.dataset.list) || [];
      items.forEach((it, i) => {
        const node = tpl.content.cloneNode(true);
        node.querySelectorAll("[data-n]").forEach(n => n.textContent = String(i + 1).padStart(2, "0"));
        fill(node, typeof it === "string" ? {text: it} : it);
        list.appendChild(node);
      });
    });
  }
  fill(document, data);
  document.title = (data.shop || "") + "｜" + (document.title || "");
  if (data.stars) document.querySelectorAll("[data-stars]").forEach(el => el.textContent = "★".repeat(data.stars) + "☆".repeat(5 - data.stars));
})();

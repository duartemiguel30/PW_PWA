self.addEventListener("install", function (event) {
  console.log("Service Worker instalado");
});

self.addEventListener("fetch", function (event) {
  // Pode adicionar lógica para cache aqui
});

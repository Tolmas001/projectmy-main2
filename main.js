const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;
    
    if (path === "/") path = "/index.html";
    
    const file = Bun.file("public" + path);
    return new Response(file);
  },
});

console.log("Server ready in 100 ms");
console.log(`Local: http://localhost:${server.port}/`);

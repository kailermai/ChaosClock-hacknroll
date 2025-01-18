console.log("Script is running!");

document.addEventListener("mousemove", (event) => {
  console.log(`Mouse moved to: X=${event.clientX}, Y=${event.clientY}`);
});

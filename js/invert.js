(function () {
  // Create a custom cursor element
  const invertedCursor = document.createElement("div");

  // Styling for the inverted cursor
  Object.assign(invertedCursor.style, {
    width: "10px",
    height: "10px",
    backgroundColor: "red",
    borderRadius: "50%",
    position: "fixed",
    pointerEvents: "none",
    zIndex: "10000",
    transform: "translate(-50%, -50%)",
  });

  document.body.appendChild(invertedCursor);

  // Function to handle mouse movement
  const updateCursorPosition = (event) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate inverted positions
    const invertedX = viewportWidth - event.clientX;
    const invertedY = viewportHeight - event.clientY;

    // Update custom cursor position
    invertedCursor.style.left = `${invertedX}px`;
    invertedCursor.style.top = `${invertedY}px`;
  };

  // Event listener for mouse movement
  document.addEventListener("mousemove", updateCursorPosition);

  // Hide the default cursor
  document.body.style.cursor = "none";
})();

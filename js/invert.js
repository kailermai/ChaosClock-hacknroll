(function () {
  // Create a custom cursor element
  const invertedCursor = document.createElement("div");

  // Styling for the inverted cursor
  Object.assign(invertedCursor.style, {
    width: "10px",
    height: "10px",
    backgroundColor: "black",
    borderRadius: "50%",
    position: "fixed",
    pointerEvents: "none",
    zIndex: "10000",
    transform: "translate(-50%, -50%)",
  });

  document.body.appendChild(invertedCursor);

  // Get the light element
  const light = document.getElementById("light");

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

    // Update light position
    light.style.left = `${invertedX - 150}px`;
    light.style.top = `${invertedY - 150}px`;
  };

  // Event listener for mouse movement
  document.addEventListener("mousemove", updateCursorPosition);

  // Apply 'cursor: none' to hide the default cursor
  document.documentElement.style.cursor = "none";
})();

const roomPosition = {
  top: document.getElementById("darkness").offsetTop,
  left: document.getElementById("darkness").offsetLeft,
};

const topMargin = roomPosition.top + window.innerHeight * Math.random();
const position = {
  left: Math.random() * roomPosition.left,
  top: topMargin + 150 < window.innerHeight ? topMargin : topMargin - 350,
};

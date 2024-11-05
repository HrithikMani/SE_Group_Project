
function AboutUs() {
  const aboutUsStyle = {
    bottom: 0,
    left: 0,
    height: '120px',
    width: "100%",
    position: 'fixed',
    backgroundColor: "rgb(42, 42, 43)", 
    color: "#fff",
    fontSize:"0.75rem",
    fontFamily:"Helvetica",
    textAlign: 'center',
    padding: '20px'
  };

  return (
    <div  style={aboutUsStyle}>
      <h3>About Us</h3>
      <p>
        Welcome to our railway services platform. We are dedicated to providing safe and efficient transportation for passengers and goods, emphasizing safety, reliability, and sustainability.
        Whether you're a passenger or a business, we're here to meet your transportation needs.
      </p>
    </div>
  );
}

export default AboutUs;


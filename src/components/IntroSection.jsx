import React from "react";
import "./IntroSection.css";

const IntroSection = React.forwardRef((props, ref) => {
  return (
    <section className="intro" ref={ref}>
      <div className="summary">
        <h2>Vice City, USA.</h2>
        <p>
          Jason and Lucia have always known the deck is stacked against them.
          But when an easy score goes wrong, they find themselves on the
          darkest side of the sunniest place in America, in the middle of a
          criminal conspiracy stretching across the state of Leonida — forced
          to rely on each other more than ever if they want to make it out
          alive.
        </p>
      </div>
    </section>
  );
});

export default IntroSection;
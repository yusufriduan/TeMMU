export default function SignUp() {
  return (
    <div className="w-screen h-screen flex flex-row">
      <div
        id="left-half"
        className="relative w-1/2 h-full flex items-center justify-center"
      >
        <div
          id="image-signup"
          className="absolute inset-0 w-full h-full flex justify-center"
        >
          {/* image source -> https://stockcake.com/i/scientific-group-discussion_785666_982782 */}
          <img
            src="/scientific-group-discussion-stockcake.jpg"
            className="w-full"
          ></img>
        </div>
        <div
          id="bg-signup"
          className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90"
        ></div>
        <div
          id="signup-right-text"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 flex justify-center items-start flex-col w-3/4"
        >
          <h1 className="text-3xl font-bold tracking-wide underline decoration-blue-400">
            Discuss, Research, Learn.
          </h1>
          <br></br>
          <p className="text-lg">
            Meet trustworthy individuals through our platform. Discover common
            interests and complete projects together.
          </p>
        </div>
      </div>
      <div id="right-half" className="w-1/2 bg-white">
        <form id="sign-up-form"></form>
      </div>
    </div>
  );
}

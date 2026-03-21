interface HeroProps {
  onButtonClick: () => void // Function to call when the button is clicked
}
const Hero: React.FC<HeroProps> = ({ onButtonClick }) => {
  return (
    <div
      className="hero growth-surface rounded-2xl lg:mt-6 hero-bloom relative overflow-hidden"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '8vh',
        paddingBottom: '4vh',
      }}
    >
      <img
        src="/additional-logo.png"
        alt="Plant accent"
        className="hidden md:block absolute -top-10 -left-10 w-44 opacity-20 rotate-12 pointer-events-none"
      />
      <img
        src="/additional-logo.png"
        alt="Plant accent"
        className="hidden md:block absolute -bottom-8 -right-12 w-52 opacity-15 -rotate-12 pointer-events-none"
      />
      <div className="hero-content flex-col lg:flex-row">
        <img
          src="/hero_upscaled.png"
          className="w-5/6 max-w-sm rounded-2xl border-2 border-emerald-200 shadow-2xl"
        />
        <div>
          <h1 className="text-5xl lg:text-6xl font-bold font-heading text-emerald-900">
            Seedling Education
          </h1>
          <p className="py-6 font-body text-xl text-emerald-900/90">
            Breaking Barriers: A Transformative STEM Journey with Enhanced
            Opportunities
            <br></br>
            <br></br>
            <hr></hr>
            <br></br>
            Discover research opportunities, boost your GPA, and receive
            guidance on the essentials of community college and transfer.
          </p>
          <button
            className="btn btn-wide rounded-full border-none bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 text-base text-white shadow-lg transition-all hover:scale-[1.04] hover:from-emerald-700 hover:to-lime-600 hover:shadow-emerald-300/70 font-accent font-semibold tracking-wide"
            onClick={onButtonClick}
          >
            Start Growing
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero

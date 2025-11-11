"use client";

export default function History() {
  return (
    <section id="history" className="w-full bg-[#f8ece4] py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-black leading-tight text-center  h-montserrat tracking-[-0.035em] mt-4">
          Campaign History & Reproducibility
        </h2>

        {/* Subtext (exactly 2 lines max) */}
        <p
          className="mt-6 mx-auto text-lg md:text-xl text-black font-mono leading-snug text-left"
          style={{
            lineHeight: "1.3",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
          }}
        >
          Maintain stable reports and a comprehensive audit trail for you
          routreach efforts. Our platform saves complete simulatio data,ensuring
          consistent results upon re-running unless you explicitly request a
          re-computation.
        </p>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Block 1 */}
          <div className="text-left">
            <div className="inline-block w-full max-w-[320px] px-10 py-4 border-[3px] border-black rounded-full text-xl font-black text-black text-center">
              1
            </div>
            <h3 className="text-2xl font-extrabold text-black  h-montserrat tracking-[-0.035em] mt-4">
              Save Simulations
            </h3>
            <p className="mt-2 text-base md:text-lg text-black font-mono leading-snug">
              All inputs, outputs, and the random seed are stored for every
              simulation.
            </p>
          </div>

          {/* Block 2 */}
          <div className="text-left">
            <div className="inline-block w-full max-w-[320px] px-10 py-4 border-[3px] border-black rounded-full text-xl font-black text-black text-center">
              2
            </div>
            <h3 className=" text-2xl font-extrabold text-black  h-montserrat tracking-[-0.035em] mt-4">
              Consistent Results
            </h3>
            <p className="mt-2 text-base md:text-lg text-black font-mono leading-snug">
              Re-running a saved simulation yields identical results, unless
              recomputation is explicitly requested.
            </p>
          </div>

          {/* Block 3 */}
          <div className="text-left">
            <div className="inline-block w-full max-w-[320px] px-10 py-4 border-[3px] border-black rounded-full text-xl font-black text-black text-center">
              3
            </div>
            <h3 className=" text-2xl font-extrabold text-black  h-montserrat tracking-[-0.035em] mt-4">
              Audit Trails
            </h3>
            <p className="mt-2 text-base md:text-lg text-black font-mono leading-snug">
              Provides a reliable record of past campaign performance and
              optimization efforts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

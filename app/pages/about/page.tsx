import Image from 'next/image'

export default function AboutPage() {
  return (
    <div>
      {/* Hero section */}
      <section className="relative h-[70vh] min-h-[500px]">
        <Image
          src="https://ext.same-assets.com/531311199/2619634078.jpeg"
          alt="Founders of Potluck"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <h1 className="text-4xl md:text-6xl font-bold text-potluck-yellow text-center px-4">
            ALL-NATURAL KOREAN STAPLES FOR EVERY PANTRY
          </h1>
        </div>
      </section>

      {/* Founder story */}
      <section className="bg-potluck-green py-16">
        <div className="potluck-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl font-bold text-potluck-darkText mb-6">Hi there,</h2>
              <div className="space-y-4 text-potluck-darkText">
                <p>
                  I'm Jen, the founder of Potluck. Growing up eating Korean food everyday (one perk of being half Korean!) I never imagined that Korean culture would become as popular as it is today.
                </p>
                <p>
                  In middle school, I watched Korean beauty take off, amazed to see sheet masks in my local pharmacy. Years later, we have K-pop frequently reaching the top 100 and Korean dramas on American streaming platforms.
                </p>
                <p>
                  Still, my favorite Korean food staples only came shipped from Korea, handmade by my mom's family. When I'd run out, I'd go to stores here and wonder why all Korean ingredients felt lackluster in comparison. I wanted staples that stood out, felt fun, were better for you, and tasted like home.
                </p>
                <p>
                  So we made Potluck, an all-natural Korean staples line inspired by the magic of gathering over a good meal. Whether you're Korean like me, love Korean flavors, or have never tried Korean food before, consider this your invitation - to try something new, to taste something made with lots of love, and to make it your own.
                </p>
                <p className="font-bold">
                  Warmly,<br />
                  Jen
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative aspect-square">
                <Image
                  src="https://ext.same-assets.com/531311199/872382249.jpeg"
                  alt="Childhood photo with mom"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="bg-potluck-yellow py-16">
        <div className="potluck-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-potluck-darkText mb-8">Our Story</h2>
            <div className="space-y-4 text-potluck-darkText text-lg">
              <p>
                The traditional way of making jangs at home has tapered off since the growth of mass market commercial production in the 1970s. While we've benefitted from the easy access and expansion of such businesses, we're also losing the art and magic of natural Korean ingredients.
              </p>
              <p>
                Potluck is an invitation to learn about and try the highest quality jangs, made the way they were supposed to be.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Illustration section */}
      <section className="py-16">
        <div className="potluck-container">
          <div className="relative aspect-[2/1] md:aspect-[3/1]">
            <Image
              src="https://ext.same-assets.com/531311199/1408529303.jpeg"
              alt="Korean food illustration"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

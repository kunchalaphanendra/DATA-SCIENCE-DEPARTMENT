import { motion } from 'motion/react';
import { Target, Eye, Award, BookOpen } from 'lucide-react';

export default function About() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-violet-900">About the Department</h1>
          <div className="mx-auto mt-4 h-1 w-24 bg-amber-500" />
        </div>

        {/* Overview */}
        <div className="mb-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-violet-900">History & Overview</h2>
            <p className="mb-4 text-gray-600 leading-relaxed">
              The Department of Computer Science and Engineering (Data Science) at Vignan Institute of Technology and Science was established in 2020 with a vision to produce high-quality professionals in the emerging field of Data Science and Artificial Intelligence.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our department offers a comprehensive B.Tech program that combines core computer science principles with advanced data analytics, machine learning, and statistical modeling. We focus on hands-on learning through modern labs, industry collaborations, and research-oriented projects.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-xl">
            <img 
              src="https://picsum.photos/seed/vitsdept/800/600" 
              alt="Department Building" 
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="mb-20 grid gap-8 md:grid-cols-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-violet-900 p-8 text-white shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-violet-900">
              <Eye size={24} />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-amber-400">Our Vision</h3>
            <p className="text-gray-200 leading-relaxed">
              To be a center of excellence in Computer Science and Engineering (Data Science) by imparting quality education, fostering research, and nurturing ethical professionals to meet the global challenges of the data-driven world.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-900 text-white">
              <Target size={24} />
            </div>
            <h3 className="mb-4 text-2xl font-bold text-violet-900">Our Mission</h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex gap-3">
                <span className="h-2 w-2 mt-2 shrink-0 rounded-full bg-amber-500" />
                <span>To provide a strong foundation in computer science and data science through innovative teaching-learning processes.</span>
              </li>
              <li className="flex gap-3">
                <span className="h-2 w-2 mt-2 shrink-0 rounded-full bg-amber-500" />
                <span>To encourage research and development in the field of Data Science and AI.</span>
              </li>
              <li className="flex gap-3">
                <span className="h-2 w-2 mt-2 shrink-0 rounded-full bg-amber-500" />
                <span>To bridge the gap between academia and industry through continuous collaboration and skill development.</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Highlights */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'JNTUH Affiliated', icon: Award, desc: 'Recognized by JNTU Hyderabad' },
            { title: 'NBA Accredited', icon: Award, desc: 'Quality assurance in education' },
            { title: 'Modern Labs', icon: BookOpen, desc: 'State-of-the-art computing facilities' },
            { title: 'Industry Ready', icon: Target, desc: 'Curriculum aligned with industry needs' },
          ].map((item, i) => (
            <div key={i} className="rounded-xl bg-gray-50 p-6 text-center shadow-sm transition-all hover:shadow-md">
              <item.icon className="mx-auto mb-4 text-violet-900" size={32} />
              <h4 className="mb-2 font-bold text-violet-900">{item.title}</h4>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import MovingLine from "../components/MovingLine";

const LandingPage = () => {
  const { scrollY } = useScroll();

  // HERO ANIMATIONS
  const fadeOut = useTransform(scrollY, [0, 250], [1, 0]);
  const moveDown = useTransform(scrollY, [0, 250], [0, 120]);
  const blurOut = useTransform(scrollY, [0, 250], ["0px", "12px"]);

  // CARDS COMING UP + OVERLAP
  const cardsMoveUp = useTransform(scrollY, [0, 400], [150, 0]); // start below + rise up
  const cardsFadeIn = useTransform(scrollY, [50, 300], [0, 1]);

  return (
    <div className="relative min-h-screen bg-[#6d33ccdc] overflow-hidden">
      <MovingLine />

      {/* HERO SECTION */}
      <motion.div
        style={{
          opacity: fadeOut,
          y: moveDown,
          filter: blurOut,
        }}
        className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-8xl text-[#fceb7c] mb-6 tracking-tight max-w-4xl"
        >
          Book. Attend. Enjoy.
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-8xl text-[#fceb7c] mb-6 tracking-tight max-w-4xl"
        >
          Event Management
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-white mb-10 max-w-2xl"
        >
          This is an Event Booking and Management System. Book Tickets for
          events seamlessly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
          className="flex items-center justify-center space-x-6"
        >
          <Link
            to="/events"
            className="px-6 py-3 bg-white text-[#6F38E8] text-lg font-semibold rounded-full flex items-center shadow-2xl hover:bg-gray-100 transition duration-300 transform hover:scale-[1.02]"
          >
            Buy Ticket
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <span className="text-white text-lg flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Kota, Rajasthan</span>
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        style={{
          y: cardsMoveUp,
          opacity: cardsFadeIn,
        }}
        className="relative z-20 px-6 pb-20 -mt-32"
      >
        <h2 className="text-center text-white text-4xl font-semibold mb-10">
          Upcoming Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {["One", "Two", "Three", "Four"].map((title, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 text-white"
            >
              <h3 className="text-xl font-semibold mb-2">Card {title}</h3>
              <p className="opacity-80">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum
                molestias quae vitae doloremque soluta possimus incidunt
                voluptate sint mollitia est placeat dolores repudiandae ipsa
                neque sed non necessitatibus officia repellat quia enim,
                recusandae ipsam praesentium. Nisi dolores repellendus soluta
                consectetur nihil, mollitia deserunt. Alias dolorum ipsum
                eligendi, natus minus debitis!
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;

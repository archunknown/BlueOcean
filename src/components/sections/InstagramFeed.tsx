'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const instagramPosts = [
  { id: 1, imageUrl: '/instagram/post-1.png', likes: 123, comments: 12 },
  { id: 2, imageUrl: '/instagram/post-2.png', likes: 245, comments: 34 },
  { id: 3, imageUrl: '/instagram/post-3.png', likes: 89, comments: 8 },
  { id: 4, imageUrl: '/instagram/post-4.png', likes: 301, comments: 56 },
  { id: 5, imageUrl: '/instagram/post-5.png', likes: 199, comments: 21 },
  { id: 6, imageUrl: '/instagram/post-6.png', likes: 450, comments: 78 },
];

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const, // <-- AÑADIR 'as const'
    },
  },
};

export default function InstagramFeed() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl font-black text-center text-oceanBlue mb-8 tracking-tight">
          Síguenos en Instagram
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12">
          @blue_ocean_paracas - Tus aventuras, nuestra pasión.
        </p>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {instagramPosts.map((post) => (
            <motion.div
              key={post.id}
              className="group relative aspect-square overflow-hidden rounded-lg shadow-md"
              variants={itemVariants}
            >
              <Image
                src={post.imageUrl}
                alt={`Instagram post ${post.id}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex space-x-4 text-white">
                  <span className="flex items-center">
                    <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                    {post.likes}
                  </span>
                  <span className="flex items-center">
                    <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                    {post.comments}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Link
            href="https://www.instagram.com/blue_ocean_paracas/" // <-- MODIFICADO
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-oceanBlue px-8 py-3 font-bold text-black shadow-lg transition-all duration-300 hover:bg-turquoise hover:scale-105"
          >
            Ver más en Instagram
          </Link>
        </div>
      </div>
    </section>
  );
}
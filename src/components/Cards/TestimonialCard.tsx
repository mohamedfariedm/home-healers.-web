import { ITestimonialCard } from "@/types";
import Image from "next/image";
import React from "react";

function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: ITestimonialCard;
  className?: string;
}) {
  return (
    <div className="w-full  flex flex-col items-center text-center p-3 bg -red-400 mb-10">
      <Image
        src={testimonial.image}
        alt={testimonial.name}
        width={100}
        height={100}
        className="rounded-full mb-4 w-16 h-16 object-cover"
      />
      <h5 className="text-lg font-semibold text-text-primary-900 mb-1">
        {testimonial.name}
      </h5>
      <h6 className="text-text-tertiary-600 mb-2">
        {testimonial.position}, {testimonial.company}
      </h6>
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < testimonial.rating ? "text-yellow-400" : "text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-gray-300">{testimonial.text}</p>
    </div>
  );
}

export default TestimonialCard;

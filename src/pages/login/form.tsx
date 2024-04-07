import React from 'react';
import { useForm } from 'react-hook-form'; // Import useForm from react-hook-form.
import Icon from '../../components/icons';

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { register, handleSubmit } = useForm<FormData>(); // Destructure register and handleSubmit from useForm.

  const onSubmit = async (formData: FormData) => {
    try {
      // Perform authentication logic here
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        // Handle successful authentication
      } else {
        // Handle authentication failure
        throw new Error('Authentication failed');
      }
    } catch (error: any) { // Explicitly type error as any
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <div className="">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                {...register('email', { required: true })} // Use register to register form fields.
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                {...register('password', { required: true, minLength: 6 })} // Register password field with validation rules.
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
          <p className="text-center mx-4 mb-0">or</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {/* Render Socials component with appropriate props */}
          <div>
            <Icon iconKey="faEnvelope" href="" />
          </div>
          <div>
            <Icon iconKey="faGithub" href="" />
          </div>
          <div>
            <Icon iconKey="faFacebook" href="" />
          </div>
          <div>
            <Icon iconKey="faTwitter" href="" />
          </div>
        </div>
      </div>
      <button type="submit" className="mt-4 w-full">
        Log in
      </button>
    </form>
  );
}

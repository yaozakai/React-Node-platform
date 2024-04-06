
import LoginForm from './form';

import waltAvatar from '../../images/Walt-avatar.png';


export default function Login() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <img
              src={waltAvatar}
              className={`z-10 absolute w-[200px]`}
              alt="Screenshot of the dashboard project showing mobile version"
          />
          <LoginForm />
  </main>
  );
}

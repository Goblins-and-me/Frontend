import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-screen h-screen bg-linear-(--gradient-main) relative">
      <Image src="/main_background.png" fill alt="main background" className='absolute -z-10' />
      <Link href="/catalog">This is dashboard page</Link>
    </div>
  );
}

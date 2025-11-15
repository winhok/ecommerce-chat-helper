import ChatWidget from '@/components/ChatWidget'
import EcommerceStore from '@/components/EcommerceStore'

export default function Home() {
  return (
    <main>
      <EcommerceStore />
      <ChatWidget />
    </main>
  )
}

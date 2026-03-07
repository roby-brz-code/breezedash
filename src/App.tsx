import { useState } from 'react'
import Layout, { type Tab } from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import QueryPage from './pages/QueryPage'
import ReconStatusPage from './pages/ReconStatusPage'

const pages: Record<Tab, () => JSX.Element> = {
  Dashboard: DashboardPage,
  Query: QueryPage,
  'Recon Status': ReconStatusPage,
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard')
  const Page = pages[activeTab]

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <Page />
    </Layout>
  )
}

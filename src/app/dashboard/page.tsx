import { Button, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

function Dashboard() {
  return (
    <TabGroup className={"flex justify-center flex-col items-center mt-10 gap-10"}>
      <TabList className={"flex gap-10 bg-(--foreground) rounded-4xl w-90 p-4"}>
        <Tab className={"rounded-4xl p-2 hover:bg-(--highlighted) data-selected:bg-(--highlighted) data-selected:text-black"}>
          Workspace
        </Tab>
        <Tab className={"rounded-4xl p-2 hover:bg-(--highlighted) data-selected:bg-(--highlighted) data-selected:text-black"}>
          Chats
        </Tab>
        <Tab className={"rounded-4xl p-2 hover:bg-(--highlighted) data-selected:bg-(--highlighted) data-selected:text-black"}>
          Forums
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel className={"w-[90vw] h-[80vh] bg-(--foreground) rounded-4xl"}>Workspaces</TabPanel>
        <TabPanel className={"w-[90vw] h-[80vh] bg-(--foreground) rounded-4xl"}>
          <div className='flex flex-row justify-between items-center h-full'> {/* Chats container */}
            <div className='flex flex-col justify-center align-center w-[45vw] h-full overflow-y-auto'> {/* Chat header would go here */}
              <div className='flex flex-col items-center justify-center flex-wrap gap-2 p-4'>
                {/* Chat list would go here */}
                <p>No chats available. Start a new chat!</p>
                <Button className='bg-brand-softer border border-brand-subtle text-fg-brand-strong px-4 py-2 rounded-lg hover:bg-brand-subtle'>Start New Chat</Button>
              </div>
            </div>
            <div className='flex flex-col justify-center align-center w-[45vw] h-full overflow-y-auto'> {/* Chat window would go here */}
              <p>Select a chat to start messaging.</p>
            </div>
          </div>
        </TabPanel>
        <TabPanel className={"w-[90vw] h-[80vh] bg-(--foreground) rounded-4xl"}>Forums</TabPanel>
      </TabPanels>
    </TabGroup>
  );
}

export default Dashboard;
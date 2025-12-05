import { Button, Tab, TabGroup, TabList, TabPanel, TabPanels, Menu, MenuButton, MenuItem, MenuItems, Input } from '@headlessui/react';
import { User } from 'lucide-react';

function Dashboard() {
  return (
    <TabGroup className={"flex flex-col items-center mt-10 gap-10"}>
      <div className='flex flex-row justify-between items-center w-[90vw]'>

        {/* left spacer */}
        <div className='flex justify-between items-center w-[10vw]'></div>

        {/* center tabs */}
        <div className='flex flex-row content-between items-center gap-6'>
          <TabList className={"flex gap-10 bg-(--foreground) rounded-4xl w-125 p-4"}>
            <Tab className={"rounded-4xl p-2 hover:bg-(--highlighted) hover:cursor-pointer data-selected:bg-(--highlighted) data-selected:text-black data-seleceted:font-bold"}>
              Workspace
            </Tab>
            <Tab className={"rounded-4xl p-2 hover:bg-(--highlighted) hover:cursor-pointer data-selected:bg-(--highlighted) data-selected:text-black data-seleceted:font-bold"}>
              Find Mentors
            </Tab>
            <Tab className={"rounded-4xl p-2 hover:bg-(--highlighted) hover:cursor-pointer data-selected:bg-(--highlighted) data-selected:text-black data-seleceted:font-bold"}>
              Chats
            </Tab>
            <Tab className={"rounded-4xl p-2 hover:bg-(--highlighted) hover:cursor-pointer data-selected:bg-(--highlighted) data-selected:text-black data-seleceted:font-bold"}>
              Forums
            </Tab>
          </TabList>
        </div>

        {/* User option */}
        <div className='flex justify-end w-1/8'>
          <Menu>
            <MenuButton className='flex flex-row items-center gap-2 bg-(--foreground) rounded-4xl w-auto p-4 data-hover:bg-(--highlighted) data-selected:bg-(--highlighted) hover:cursor-pointer'>
              <User size={30} />
              <span>My account</span>
            </MenuButton>
            <MenuItems anchor="bottom end" transition className="bg-(--foreground) rounded-3xl p-2 flex flex-col gap-2 border-black border w-(--button-width) --anchor-gap: 8px origin-top transition duration-200 ease-out data-closed:scale-95 data-closed:opacity-0">
              <MenuItem>
                <a className="block pl-2 data-focus:bg-(--highlighted) rounded-2xl p-1" href="/profile">
                  My Profile
                </a>
              </MenuItem>
              <MenuItem>
                <a className="block pl-2 data-focus:bg-(--highlighted) rounded-2xl p-1" href="/logout">
                  Logout
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
      <TabPanels>
        <TabPanel className={"w-[90vw] h-[80vh] bg-(--foreground) rounded-4xl"}>Workspaces</TabPanel>

        <TabPanel className={"w-[90vw] h-[80vh] bg-(--foreground) rounded-4xl"}> {/* Find Mentors Container */}
          <div className='flex flex-col justify-center items-center w-full h-full'>
            <h1 className='text-2xl mb-1 font-bold'>Looking for Mentor?</h1>
            <span className='text-lg mb-4'>Just Search!</span>
            <form className='flex flex-row gap-4'>
              <Input name='full_name' type='text' className={'bg-sky-800 rounded-lg p-2 text-white'} placeholder='Type the name!'></Input>
              <Button className={'bg-sky-800 rounded-lg p-2 text-white data-hover:bg-(--highlighted) data-hover:cursor-pointer'}>Search</Button>
            </form>

            {/* Recommended Mentors Section */}
            <div className='flex flex-col mt-4'>
              <h1>Here's some recommended tutors you may like!</h1>
              <div className='grid grid-cols-3 gap-4 mt-4'>
                {/* Mentor cards would go here */}
              </div>

              {/* Search Results */}
              <div className=' hidden grid-cols-3 gap-4 mt-4'>
                <h1>Search Results for NAME INPUT</h1>
                {/* Mentor cards would go here */}
              </div>

              {/* No Results Message */}
              <div className='hidden mt-4'>
                <p>No mentors found. Try searching with different keywords.</p>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel className={"w-[90vw] h-[80vh] bg-(--foreground) rounded-4xl"}>
          <div className='flex flex-row justify-between items-center h-full'> {/* Chats container */}
            <div className='flex flex-col justify-center align-center w-[45vw] h-full overflow-y-auto'> {/* Chat header would go here */}
              <div className='flex flex-col flex-wrap gap-2 p-4'>
                {/* Chat Lists */}
                <div className='hidden flex-col gap-4'>
                  {/* Chat list would go here */}
                </div>

                {/* No chats message */}
                <div className='flex flex-col items-center justify-center gap-4 mt-10'>
                  <p>No chats available. Start a new chat!</p>
                  <Button className='bg-orange-400 border border-brand-subtle text-fg-brand-strong px-4 py-2 rounded-lg hover:cursor-pointer hover:font-bold'>Start New Chat</Button>
                </div>
              </div>
            </div>
            <div className='border-l border-gray-300 h-[60vh] shadow-4xl'></div>
            <div className='flex flex-col items-center justify-center flex-wrap gap-2 p-4 w-[45vw] h-full overflow-y-auto'> {/* Chat window would go here */}
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
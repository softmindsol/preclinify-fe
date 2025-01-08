import React from 'react'
import Sidebar from '../components/common/Sidebar'
import StackedBarWithSign from '../components/charts/stacked-barwith-sign'

const Performance = () => {
   
  return (
    <div className='flex '>
          <div className="">
              <Sidebar />
          </div>
          <div className="flex-1 p-4 mt-20">
            <div className='flex items-center justify-center gap-32'>
                  <div>
                    <h1 className='text-center text-[16px]'>Me vs other user</h1>
                      <StackedBarWithSign />
                  </div>

                  <div>
                      <h1 className='text-center text-[16px]'>me vs everyone in the university</h1>

                      <StackedBarWithSign />
                  </div>
            </div>
              <div className='flex items-center justify-center gap-32 mt-10'>
                  <div>
                      <h1 className='text-center text-[16px]'>me vs everyone in university of year group</h1>
                      <StackedBarWithSign />
                  </div>

                  <div>
                      <h1 className='text-center text-[16px]'>bar chart for worst performing topics</h1>

                      <StackedBarWithSign />
                  </div>
              </div>
            
          </div>
                     
             
         
    </div>
  )
}

export default Performance
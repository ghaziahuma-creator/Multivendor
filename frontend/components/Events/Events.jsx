import React, { useEffect } from 'react'
import styles from '../../src/styles/styles'
import EventCard from "./EventCard"
import { useSelector } from 'react-redux'
import Loader from '../Layout/Loader'

const Events = () => {
  const {allEvents, isLoading} = useSelector((state)=> state.events);
  return (
       <div>
      {isLoading ? (
        <Loader/>
      ) : (
        <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Popular Events</h1>
        </div>
        <div className='w-full grid'>
          {
            allEvents.length !== 0 && (
               <EventCard data={allEvents && allEvents[0]}/>
            )
          }
          {
            allEvents.length === 0 &&(
              <div className='w-[98%] bg-white h-[100px] rounded-[20px] flex items-center justify-center mb-8'>
              <h5 className='font-Poppins text-[20px] text-red-500 font-bold'>
               Your next adventure hasn’t arrived yet. Stay tuned!
              </h5>
              </div>
            )
          }
        </div>
      </div>
      )}
    </div>
  )
}

export default Events
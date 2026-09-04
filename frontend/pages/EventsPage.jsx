import React from 'react'
import Header from '../components/Layout/Header'
import EventCard from '../components/Events/EventCard'
import Loader from '../components/Layout/Loader'
import { useSelector } from 'react-redux'

const EventsPage = () => {
  const {allEvents, isLoading} = useSelector((state)=> state.events);
  return (
    <>
    {isLoading ? (
      <Loader/>
    ):(
        <div >
        <Header activeHeading={4}/>
        <div className='my-10 mx-10'>
                  {
          allEvents && allEvents .map((i)=>(
              <EventCard  active={true} data={i}/>
          ))
        }
        </div>
      
       
    </div>
    )}
    </>
    
  )
}

export default EventsPage
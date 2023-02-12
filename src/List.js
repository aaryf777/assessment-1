import React from 'react'

export default function List({item,query}) {
    const [key, value] = item;
  return (
        key === 'items' ? <></>
        : key === 'found' ? 
        !!value.length && value[0].toLowerCase().indexOf(query.toLowerCase()) > -1 && <div style={{padding: '5px',margin: '5px',borderBottom:'1px solid gray',borderTop:'1px solid gray'}} className='small'>
                    <span >{value[0].substring(0,value[0].toLowerCase().indexOf(query.toLowerCase()))}</span>
                    <span style={{color:'blue'}}>{value[0].substring(value[0].toLowerCase().indexOf(query.toLowerCase()),value[0].toLowerCase().indexOf(query.toLowerCase()) + query.length)}</span>
                    <span>{value[0].substring(value[0].toLowerCase().indexOf(query.toLowerCase())+query.length)}</span>
                    <span>  in values</span>
                  </div>
        : value.toLowerCase().indexOf(query.toLowerCase()) > -1 ? <div className={`${key === 'id' ? 'id' : 'small'}`}>
          <span >{value.substring(0,value.toLowerCase().indexOf(query.toLowerCase()))}</span>
          <span style={{color:'blue'}}>{value.substring(value.toLowerCase().indexOf(query.toLowerCase()),value.toLowerCase().indexOf(query.toLowerCase()) + query.length)}</span>
          <span>{value.substring(value.toLowerCase().indexOf(query.toLowerCase())+query.length)}</span>
        </div>
        : <div className={`${key === 'id' ? 'id' : 'small'}`}>{value}</div>
      
  )
}

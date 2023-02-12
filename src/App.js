import { useEffect, useRef, useState, useCallback } from 'react';
import './App.css';
import debounceWrapper from './debounce';

function App() {
  const [filterList, setFilterList] = useState([]);
  const [loading, setloading] = useState(false)
  const [query, setQuery] = useState('');
  const [select, setSelect] = useState(0);
  const [keyPress, setKeyPress] = useState({
    code : '',
    toggle: true
  });
  const listRef = useRef([])
  const debounce = useCallback(debounceWrapper(),[])
  
  async function getData(query) {
    let res = await fetch('http://www.mocky.io/v2/5ba8efb23100007200c2750c');
    let data = await res.json();
    let fData = data.filter(ele => (
    ele.name.toLowerCase().indexOf(query.toLowerCase()) > -1 
    || ele.address.toLowerCase().indexOf(query.toLowerCase()) > -1
    || ele.id.toLowerCase().indexOf(query.toLowerCase()) > -1
    || ele.pincode.toLowerCase().indexOf(query.toLowerCase()) > -1
    || ele.items.includes(query)
    )).map(ele => ({...ele,found: ele.items.filter(x => x === query)  }))
    setFilterList(fData)
    setloading(false);
  }

  
  useEffect(() => {
    const handleKeyup = e => {
       if(e.code === 'ArrowDown') { 
        setKeyPress({code:'down',toggle: !keyPress.toggle});
       } else if(e.code === 'ArrowUp') { 
        setKeyPress({code:'up',toggle: !keyPress.toggle});
      }
      
    }
    document.addEventListener('keydown', handleKeyup )
    return () => {
      document.removeEventListener('keydown',()=>{console.log('removing listner')})
    }

  },[])

  useEffect(() => {
    keyPress.code === 'down' &&  setSelect(select < filterList.length-1 ? select+1 : select)
    keyPress.code === 'up' && setSelect(select > 0 ? select-1 : select)
    listRef.current[select]?.scrollIntoView({ behavior: 'smooth' })
  },[keyPress])
 

  useEffect(() => {
    if(query.length){
      setloading(true);
      debounce(getData,1000,query);
    }
  },[query])
  

  return (
    <div className="App">
      <input type='search' placeholder='search list' value={query} onChange={e  => setQuery(e.target.value)}/>
      
      { !!query.length && (
         loading ? <>Loading....</> : filterList.length ? <div className='list'>
            {
              filterList.map((item,i) => <div ref={(el) => (listRef.current[i] = el)} key={item.id} className='item'   onMouseMove={(e) => {setSelect(i);listRef.current[select].scrollIntoView({ behavior: 'smooth' })}} style={{background : item.id === filterList[select]?.id ? 'lightgray':''}}>
                {
                  item.id.toLowerCase().indexOf(query.toLowerCase()) > -1 ? <div className='id'>
                    <span >{item.id.substring(0,item.id.toLowerCase().indexOf(query.toLowerCase()))}</span>
                    <span style={{color:'blue'}}>{item.id.substring(item.id.toLowerCase().indexOf(query.toLowerCase()),item.id.toLowerCase().indexOf(query.toLowerCase()) + query.length)}</span>
                    <span>{item.id.substring(item.id.toLowerCase().indexOf(query.toLowerCase())+query.length)}</span>
                  </div>
                  : <div className='id'>{item.id}</div>
                }
                {
                  item.name.toLowerCase().indexOf(query.toLowerCase()) > -1 ? <div className='name'>
                    <span >{item.name.substring(0,item.name.toLowerCase().indexOf(query.toLowerCase()))}</span>
                    <span style={{color:'blue'}}>{item.name.substring(item.name.toLowerCase().indexOf(query.toLowerCase()),item.name.toLowerCase().indexOf(query.toLowerCase()) + query.length)}</span>
                    <span>{item.name.substring(item.name.toLowerCase().indexOf(query.toLowerCase())+query.length)}</span>
                  </div>
                  : <div className='name'>{item.name}</div>
                }

                {!!item.found.length && item.found[0].toLowerCase().indexOf(query.toLowerCase()) > -1 && <div style={{padding: '5px',margin: '5px',borderBottom:'1px solid lightgray',borderTop:'1px solid lightgray'}} className='small'>
                    <span >{item.found[0].substring(0,item.found[0].toLowerCase().indexOf(query.toLowerCase()))}</span>
                    <span style={{color:'blue'}}>{item.found[0].substring(item.found[0].toLowerCase().indexOf(query.toLowerCase()),item.found[0].toLowerCase().indexOf(query.toLowerCase()) + query.length)}</span>
                    <span>{item.found[0].substring(item.found[0].toLowerCase().indexOf(query.toLowerCase())+query.length)}</span>
                    <span> found in items</span>
                  </div>
                }

                {
                  item.pincode.toLowerCase().indexOf(query.toLowerCase()) > -1 ? <div className='small'>
                    <span >{item.pincode.substring(0,item.pincode.toLowerCase().indexOf(query.toLowerCase()))}</span>
                    <span style={{color:'blue'}}>{item.pincode.substring(item.pincode.toLowerCase().indexOf(query.toLowerCase()),item.pincode.toLowerCase().indexOf(query.toLowerCase()) + query.length)}</span>
                    <span>{item.pincode.substring(item.pincode.toLowerCase().indexOf(query.toLowerCase())+query.length)}</span>
                  </div>
                  : <div className='small'>{item.pincode}</div>
                }
                {
                  item.address.toLowerCase().indexOf(query.toLowerCase()) > -1 ? <div className='small'>
                    <span >{item.address.substring(0,item.address.toLowerCase().indexOf(query.toLowerCase()))}</span>
                    <span style={{color:'blue'}}>{item.address.substring(item.address.toLowerCase().indexOf(query.toLowerCase()),item.address.toLowerCase().indexOf(query.toLowerCase()) + query.length)}</span>
                    <span>{item.address.substring(item.address.toLowerCase().indexOf(query.toLowerCase())+query.length)}</span>
                  </div>
                  : <div className='small'>{item.address}</div>
                }

              </div>)
            }
        </div>
        : <div className='nodata'>No data found</div>)
      }
    </div>
  );
}

export default App;

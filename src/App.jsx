import React, { useEffect, useState } from 'react';
import { Select, Layout, Image, Typography , Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Header, Footer, Content } = Layout;
const { Paragraph } = Typography;


const App = () => {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [catInfo, setCatInfo] = useState({ image: '', description: '' });
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchBreeds = async () => {
      const response = await fetch('https://api.thecatapi.com/v1/breeds');
      const data = await response.json();
      setBreeds(data);
    };
    const fetchMessages = async () => {
      try {
        const response = await fetch("/.netlify/functions/sign");
        const data = await response.json();
        setMessages(data); // 假设这是一个数组
      } catch (error) {
        console.error("Error fetching data from Netlify function", error);
      }
    };
    fetchBreeds();
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchCatInfo = async () => {
      if (selectedBreed) {
        const response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${selectedBreed}`);
        const imageData = await response.json();
        const breedData = breeds.find(breed => breed.id === selectedBreed);
        if (imageData.length > 0) {
          setCatInfo({ 
            image: imageData[0].url,
            description: breedData.description,
            vetstreet_url: breedData.vetstreet_url
          });
          
        }
      }
    };

    fetchCatInfo();
  }, [selectedBreed, breeds]);

  const handleBreedChange = (value) => {
    setSelectedBreed(value);
  };
  const handleVetstreetClick = () => {
    if (catInfo.vetstreet_url) {
      window.open(catInfo.vetstreet_url, '_blank');
    }
  };
  
  return (
    <Layout>
      <Header style={{textAlign: 'center', lineHeight: '64px', color: 'white' }}>Choose a Cat Breed</Header>
      <Content style={{  padding: '20px', display: 'flex' }}>
        <Select
          showSearch
          placeholder="Select a breed"
          optionFilterProp="children"
          onChange={handleBreedChange}
          style={{ width: 200, marginRight: '30px' }}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {breeds.map(breed => (
            <Select.Option key={breed.id} value={breed.id}>{breed.name}</Select.Option>
          ))}
        </Select>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {catInfo.image && (
            <Image 
              src={catInfo.image} 
              alt="Cat" 
              style={{ width: '800px', 
              height: '600px', 
              marginRight: '30px', 
              objectFit: 'cover' }} 
            />
          )} 
          <div>
            <Paragraph>{catInfo.description}</Paragraph>
            {catInfo.vetstreet_url && (
              <Button type="link" href={catInfo.vetstreet_url} target="_blank">
                
              </Button>
            )}
          </div>
        </div>
        
      </Content>
      {catInfo.vetstreet_url && (
        <Button
          type="primary"
          shape="circle"
          icon={<QuestionCircleOutlined />}
          onClick={handleVetstreetClick}
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 1000,
          }}
        />
      )}
      <Footer>
      {messages.map((item, index) => (
          <div key={index}>
            <p style={{textAlign: 'center', lineHeight: '64px'}}>{item.school} - {item.myName} 2023</p>
          </div>
        ))}
        </Footer>
    </Layout>
  );
};

export default App;

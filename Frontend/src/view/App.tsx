<<<<<<< Updated upstream
import { useState } from 'react';
import '../style/App.css';
import Header from '../components/Header';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import AddPage from '../pages/AddPage';
import IntroPage from '../pages/introPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'intro' | 'home' | 'search' | 'add'>('intro');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
=======
import { useEffect, useState } from 'react'
import '../style/App.css'
import { asyncGet, asyncDelete, asyncPost, asyncPut } from '../utils/fetch'
import { api } from '../enum/api'
import pic1 from '../images/Group 25.png'

interface Restaurant {
  _id: string;
  name: string;
  location: string;
  category: string;
  rating: string;
}

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [activeTab, setActiveTab] = useState<'intro' | 'home' | 'search' | 'add'>('intro');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Restaurant[]>([]);

  const [formData, setFormData] = useState({
    rid: '',    // 新增這行
    name: '',
    location: '',
    category: '',
    rating: ''
  });

  const [searchName, setSearchName] = useState('');
  const [updateName, setUpdateName] = useState('');

  const areas = [
    '北投區', '士林區', '大同區', '中山區', '松山區', '內湖區',
    '萬華區', '中正區', '大安區', '信義區', '南港區', '文山區',
    '板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區',
    '土城區', '蘆洲區', '樹林區', '汐止區', '鶯歌區', '三峽區',
    '淡水區', '瑞芳區', '五股區', '泰山區', '林口區', '深坑區',
    '石碇區', '坪林區', '三芝區', '石門區', '八里區', '平溪區',
    '雙溪區', '貢寮區', '金山區', '萬里區', '烏來區'
  ];

  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    if (s1.includes(s2) || s2.includes(s1)) {
      return 1;
    }
    let common = 0;
    for (let char of s1) {
      if (s2.includes(char)) {
        common++;
      }
    }
    return common / Math.max(s1.length, s2.length);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (selectedArea) {
      const filtered = restaurants.filter(r => r.location.includes(selectedArea));
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [selectedArea, restaurants]);

  const fetchRestaurants = async () => {
    try {
      const response = await asyncGet(api.findAll);
      if (response.code === 200 && response.body) {
        setRestaurants(response.body);
        setFilteredRestaurants(response.body);
      }
    } catch (error) {
      console.error('獲取餐廳列表失敗:', error);
    }
  };

  const handleAddRestaurant = async () => {
    if (!formData.rid || !formData.name || !formData.location || !formData.category || !formData.rating) {
      alert('請填寫所有欄位');
      return;
    }

    try {
      const response = await asyncPost(api.insertOne, formData);
      if (response.code === 200) {
        alert('新增成功');
        fetchRestaurants();
        setFormData({ rid: '', name: '', location: '', category: '', rating: '' });  // 重設表單時也清空rid
      } else if (response.code === 400) {
        alert('餐廳名稱已存在');
      }
    } catch (error) {
      alert('新增失敗');
      console.error(error);
    }
  };

  const handleSearch = async () => {
    if (!searchName.trim()) {
      alert('請輸入餐廳名稱');
      return;
    }

    try {
      const response = await asyncGet(api.findAll);
      if (response.code === 200 && response.body) {
        const results = response.body
          .filter((restaurant: { name: string }) => 
            restaurant.name.toLowerCase().includes(searchName.toLowerCase())
          );

        setSearchResults(results);

        if (results.length === 0) {
          alert('找不到相關餐廳');
        }
      }
    } catch (error) {
      alert('搜尋失敗');
      console.error(error); 
    }
  };
  
  const handleUpdate = async (currentName: string) => {
    if (!updateName) {
      alert('請輸入新名稱');
      return;
    }

    try {
      const response = await asyncPut(`${api.update}?oldName=${currentName}&newName=${updateName}`);
      if (response.code === 200) {
        alert('更新成功');
        fetchRestaurants();
        setUpdateName('');
        handleSearch();
      } else if (response.code === 400) {
        alert('新名稱已存在');
      }
    } catch (error) {
      alert('更新失敗');
      console.error(error);
    }
  };

  const handleDelete = async (name: string) => {
    if (window.confirm('確定要刪除此餐廳嗎？')) {
      try {
        const response = await asyncDelete(`${api.delete}?name=${name}`);
        if (response.code === 200) {
          alert('刪除成功');
          fetchRestaurants();
          setSearchResults(prev => prev.filter(r => r.name !== name));
        }
      } catch (error) {
        alert('刪除失敗');
        console.error(error);
      }
    }
  };
>>>>>>> Stashed changes

  return (
    <div className="app-container">
      <div className="container">
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
        <div className="content-wrapper">
          <main className="main-content">
            {currentPage === 'intro' && <IntroPage />}
            {currentPage === 'home' && <HomePage />}
            {currentPage === 'search' && <SearchPage />}
            {currentPage === 'add' && <AddPage />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
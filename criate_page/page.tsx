'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getGridTemplateColumns = () => {
    if (!isMenuOpen) return "0% auto";
    return isMobile ? "75% auto" : "30% auto";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <main style={{
      fontFamily: 'sans-serif',
      display: 'flex',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      margin: 0
    }}>

      <div style={{
        height: '100vh',
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#ffffff',
        display: 'grid',
        gridTemplateRows: '60px auto',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <header style={{
          display: 'grid',
          gridTemplateColumns: "60px 60px auto 60px",
          borderBottom: '1px solid #eee'
        }}>

          <div style={{
            backgroundColor: "#999",
            color: "#fff",
            fontSize: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer"
          }}
            onClick={toggleMenu}>...</div>

          <Link href="/Choice" style={{
            backgroundColor: '#0070f3',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '5px',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            margin: '5px'
          }}>CH</Link>

          <h1 style={{
            margin: 0,
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: "center",
            justifyContent: "center",
            paddingRight: '120px'
          }}>Моё приложение</h1>


          <Link href="/login " style={{
            backgroundColor: '#0070f3',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '5px',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            margin: '5px'
          }}>Log</Link>
        </header>

        <div id="page"
          style={{
            display: "grid",
            gridTemplateColumns: getGridTemplateColumns(),
            transition: 'grid-template-columns 0.4s ease',
          }}>

          {/* Список контактов */}
          <div style={{
            backgroundColor: "#999",
            overflow: "hidden",
            borderRight: isMenuOpen ? '1px solid #eee' : 'none'
          }}>

            {/* Карточка 1 */}
            <div style={{
              height: "70px",
              width: "100%",
              display: 'grid',
              gridTemplateColumns: "70px auto",
              borderBottom: '1px solid #eee',
              cursor: 'pointer'
            }}>
              <div style={{
                height: "100%",
                width: "100%",
                backgroundColor: '#888',
                color: '#fff',
                display: 'flex',
                alignItems: "center",
                justifyContent: "center"
              }}>
                ik
              </div>
              <div style={{
                display: 'flex',
                alignItems: "center",
                justifyContent: "left",
                paddingLeft: "15px",
                color: '#fff'
              }}>
                name1
              </div>
            </div>


            <div style={{
              height: "70px",
              width: "100%",
              display: 'grid',
              gridTemplateColumns: "70px auto",
              borderBottom: '1px solid #eee',
              cursor: 'pointer'
            }}>
              <div style={{
                height: "100%",
                width: "100%",
                backgroundColor: '#888',
                color: '#fff',
                display: 'flex',
                alignItems: "center",
                justifyContent: "center"
              }}>
                ik
              </div>
              <div style={{
                display: 'flex',
                alignItems: "center",
                justifyContent: "left",
                paddingLeft: "15px",
                color: '#fff'
              }}>
                name2
              </div>
            </div>

          </div>

          <div style={{ padding: '20px' }}>
            <p style={{ color: '#666', textAlign: 'center' }}>

            </p>
          </div>

        </div>

      </div>
    </main>
  );
}

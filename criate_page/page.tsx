"use client";

import Link from 'next/link';
import { useState } from "react";
import Image from "next/image";


export default function CakeApp() {

  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState<"S" | "M" | "L">("M");

  const weightMap = {
    S: "1.0 kg",
    M: "1.5 kg",
    L: "2.0 kg",
  };

  const calMap = {
    S: "126 cal",
    M: "189 cal",
    L: "252 cal",
  };

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const basePrice = 39.0;

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'grid',
      gridTemplateRows: '8vh 28vh 8vh 8vh 8vh 8vh 18vh 14vh',
      gridTemplateColumns: '100vw',
      background: 'linear-gradient(180deg, #fcdcd9 0%, #fcdcd9 45%, #dadada 100%)',
      position: 'relative'
    }}>

      <Link href={"D:\Front\suxarik\app"} style={{
        gridRow: '1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 6vw',
        paddingTop: '2vh'
      }}>

        <div style={{
          fontSize: '24px',
          color: '#EC9E49',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>&#8592;</div>

        <div style={{
          background: 'white',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
          color: '#EC9E49',
          fontSize: '20px',
        }}>&#9829;</div>
      </Link>

      <div style={{
        gridRow: '2 / 5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        height: '100%',     
      }}>
        <Image
          src="/cake.png"
          alt="CAKE"
          width={200}
          height={200} 
          style={{
            width: 'auto',      
            height: '100%',     
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))'
          }}
          priority
        />
      </div>

      <div style={{
        gridRow: '4',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '-2vh',}}>

        <div style={{
          backgroundColor: '#EC9E49',
          height: '6vh',
          width: '35vw',
          borderRadius: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 5px',
          boxShadow: '0 5px 15px rgba(236, 158, 73, 0.4)'
        }}>

          <div onClick={decrement}
            style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              width: '40px',
              textAlign: 'center',
              cursor: 'pointer',
              userSelect: 'none'
            }}>-</div>

          <div style={{
            backgroundColor: '#FAE8D4',
            width: '50px',
            height: '4.5vh',
            borderRadius: '25px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: '700',
            fontSize: '18px',
            color: '#333'
          }}>{quantity}</div>

          <div onClick={increment}
            style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              width: '40px',
              textAlign: 'center',
              cursor: 'pointer',
              userSelect: 'none'
            }}>+</div>

        </div>
      </div>

      <div style={{
        gridRow: '5',
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        alignItems: 'center'
      }}>

        {(['S', 'M', 'L'] as const).map((item) => {
          const isSelected = size === item;
          
          const currentBg = (isSelected) ? '#FAE8D4' : '#DDE1EC';

          return (
            <button
              key={item}
              onClick={() => setSize(item)}
              style={{
                width: '60px',
                height: '45px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: '600',
                fontSize: '18px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                border: isSelected ? '2px solid #EC9E49' : 'none',
                backgroundColor: currentBg,
                color: '#333',
                transform: isSelected ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 0.1s'
              }}
            >
              {item}
            </button>
          );
        })}
      </div>

      <div style={{
        gridRow: '6 / 10',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        boxShadow: '0 -5px 20px rgba(0,0,0,0.1)',
        position: 'relative',
        display: 'grid',
        gridTemplateRows: '12vh 1fr',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 20px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <div style={{ fontSize: '24px', height: '30px', display: 'flex', alignItems: 'center' }}>&#128293;</div>
            <div style={{ fontSize: '11px', color: '#555', fontWeight: 500 }}>{calMap[size]}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <div style={{ fontSize: '24px', height: '30px', display: 'flex', alignItems: 'center', color:'black' }}>&#9878;</div>
            <div style={{ fontSize: '11px', color: '#555', fontWeight: 500 }}>{weightMap[size]}</div>
          </div>
        </div>

        <div style={{
            backgroundColor: '#FFDAD6',
            borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
            padding: '15px',
            fontSize: '12px',
            color: '#333',
            lineHeight: '1.5'
          }}>
          <span style={{ fontWeight: 700, color: '#000', display: 'block', marginBottom: '4px' }}>Description :</span> Strawberry cake is a cake that uses Strawberry as a primary ingredient. Strawberries may be used in the cake batter, atop cakes and in a strawberry cake's frosting.
        </div>
      </div>

      <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'}}>

        <button style={{
            backgroundColor: '#EC9E49',
            color: 'white',
            border: 'none',
            height: '50px',
            width: '55%',
            borderTopLeftRadius: '25px',
            borderTopRightRadius: '25px',
            borderBottomLeftRadius: '25px',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 5px 15px rgba(236, 158, 73, 0.4)',
            cursor: 'pointer'
          }}>Add to cart</button>

        <div style={{
            backgroundColor: '#F8F8F8',
            color: '#000',
            height: '50px',
            width: '40%',
            borderRadius: '25px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: '700',
            boxShadow: 'inset 0 0 0 1px #eee'
          }}>
            {(basePrice * quantity).toFixed(2)} BYN</div>
      </div>


    </div>

  );
}

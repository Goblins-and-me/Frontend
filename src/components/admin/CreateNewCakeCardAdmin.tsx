

export default function CreateNewCakeCard() {
  return (
    <div className="relative flex flex-col items-center justify-center rounded-3xl overflow-hidden bg-white shadow-lg">
      <div className="bg-createNewCakeBG flex-[3] w-full relative flex items-center justify-center" >
        <img src="/vector.png"></img>
      </div>
      <div className="bg-createNewCakeBotom flex-[1] w-full flex flex-row">
        <h2 className="text-2xl font-medium font-main text-black text-center self-center w-full">Новый рецепт</h2>
      </div>
    </div>
  );
}

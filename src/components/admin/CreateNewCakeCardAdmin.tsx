

export default function CreateNewCakeCard() {
  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center rounded-3xl overflow-hiddenn bg-white shadow-lg">
      <div className="bg-createNewCakeBG flex-[3] w-full relative flex items-center justify-center overflow-hidden" >
        <img src="/vector.png" className="overflow-hidden"></img>
      </div>
      <div className="bg-createNewCakeBotom flex-[1] w-full flex flex-row overflow-hidden">
        <h2 className="text-2xl font-medium font-main text-black text-center self-center w-full overflow-hidden">Новый рецепт</h2>
      </div>
    </div>
  );
}

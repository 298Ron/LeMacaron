import { FunctionComponent } from "react";

interface AboutProps {

}

const About: FunctionComponent<AboutProps> = () => {
    return (
        <>
            <div className="container about mb-5 animationLeftSlide" style={{ height: "150%", }}>
                <h3 className="display-5 mb-3 pt-4 border-dark border-bottom">ABOUT</h3>
                <div className=" backColorImage shadow-lg animationLeftSlide" style={{ fontSize: "1.3rem", margin: "0 auto", width: "80%", fontFamily: 'Pacifico' }}>
                    <div className="row p-3">
                        <img className="col-md-8" src="images/aboutPageMacaroons.jpg" alt="aboutPageMacaroons" style={{ objectFit: "contain", }} />
                        <div className="col-md-4 mt-2">
                            <h2 >Le Macaron Boutique</h2>
                            <p >Мастер-класс 1.06.2023
                                Это было невероятно, познавательно и вкусно😋
                                Каждый унес с собою не только знания , крутой заряд энергии и творчества а и много много макаронс☺️
                                Дружелюбная атмосфера , много фото , вино и плата сыров царила на этой кухне😍
                                Теперь девочки смогут радовать своих близких , удивлять гостей и делать вкусняшки своим деткам 😋
                                А кто-то даже сможет на этом заработать😏
                                Хочешь так же?
                                Пиши я всегда всем рада❤️</p>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default About;
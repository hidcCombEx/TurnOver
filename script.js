//============================================
//이미지 드래그 방지

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("img").forEach((img) => {
        img.setAttribute("draggable", "false");
        img.addEventListener("mousedown", (e) => e.preventDefault());
    });
});

//============================================
//부드러운 스크롤

window.addEventListener("wheel", function(event) {
    event.preventDefault();
    window.scrollBy({
        top: event.deltaY * 0.7, // 70% 속도로 부드럽게 스크롤
        behavior: "smooth"
    });
}, { passive: false });


//============================================
// 화면 크기 체크 (전역 변수)
function getScreenType() {
    return {
        isMobile: window.matchMedia("(max-width: 767px)").matches,
        isTablet: window.matchMedia("(max-width: 1023px)").matches,
    };
}

//============================================
// Return 버튼 추가 여부 체크 (모든 페이지에서 사용 가능)
function checkAndAddReturnButton() {
    const { isMobile, isTablet } = getScreenType();
    const rightPanel = document.querySelector(".right .project-detail-info");

    if (rightPanel) {
        if (isMobile || isTablet ) {
            // ✅ return 버튼이 없으면 강제로 추가
            if (!document.querySelector(".right-return-button")) {
                console.log("📌 return 버튼이 없어서 강제로 추가함");
                rightPanel.insertAdjacentHTML("afterbegin", `
                    <div class="right-return-button">
                        <svg width="18" height="30" viewBox="0 0 18 30" fill="none">
                            <path d="M16.667 1.66797L3.33366 15.0013L16.667 28.3346" stroke="#A9A9A9" stroke-width="3.33333"/>
                        </svg>
                    </div>
                `);
                addReturnButtonEvent();
            }
        } else {
            removeReturnButton();
        }
    }
}


//============================================
// 특정 요소가 추가될 때까지 기다리는 함수
function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
        callback();
    } else {
        // `MutationObserver`를 이용해 요소가 추가되었는지 감지
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                callback();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
}

//============================================
// 우측 패널에서 돌아가기 버튼 추가
function addReturnButtonEvent() {
    const returnButton = document.querySelector(".right-return-button");
    const rightScrollContainer = document.querySelector(".right-scroll-container");
    const projectItems = document.querySelectorAll(".project-item"); // ✅ 모든 프로젝트 아이템 가져오기

    if (returnButton) {
        returnButton.addEventListener("click", function () {
            console.log("📌 right-return-button 클릭됨, 패널 닫기");

            // ✅ 모든 프로젝트 아이템에서 `clicked-project` 클래스 제거
            projectItems.forEach(item => item.classList.remove("clicked-project"));

            // ✅ 우측 패널 닫기
            rightScrollContainer.classList.remove("active");
        });
    }
}

//============================================
// 돌아가기 버튼 제거 함수
function removeReturnButton() {
    let returnButton = document.querySelector(".right-return-button");
    if (returnButton) returnButton.remove();
}

//============================================
// 창 크기 변경 시 자동 체크
// ✅ 창 크기 변경 감지해서 return arrow 즉시 추가
window.addEventListener("resize", () => {
    checkAndAddReturnButton();
});

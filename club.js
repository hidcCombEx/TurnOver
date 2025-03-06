//페이지 로드 후 실행
document.addEventListener("DOMContentLoaded", mergeProjects);


//============================================
//이미지 드래그 방지

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("img").forEach((img) => {
        img.setAttribute("draggable", "false");
        img.addEventListener("mousedown", (e) => e.preventDefault());
    });
});


//============================================
// 스크롤 제어 (전역 변수 활용)
document.addEventListener("wheel", function (event) {
    const { isMobile, isTablet } = getScreenType();
    const leftContainer = document.querySelector(".left");
    const scrollContainer = document.querySelector(".left-scroll-container");
    const rightContainer = document.querySelector(".right");

    if (!leftContainer || !scrollContainer || !rightContainer) return;

    const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);

    if (isMobile || isTablet) {
        // 📌 모바일에서는 `.left-scroll-container`에서 스크롤해도 `.left`가 스크롤됨
        if (scrollContainer.contains(hoveredElement)) {
            leftContainer.scrollTop += event.deltaY;
        } else {
            leftContainer.scrollTop += event.deltaY;
        }
    } else {
        // 📌 데스크톱에서는 기본 동작
        if (rightContainer.contains(hoveredElement)) {
            rightContainer.scrollTop += event.deltaY;
        } else {
            scrollContainer.scrollTop += event.deltaY;
        }
    }

    event.preventDefault(); // 기본 스크롤 이벤트 방지
}, { passive: false });


//============================================
//모든 프로젝트 데이터를 하나로 합치는 배열
const allProjects = [];


//============================================
//프로젝트 데이터를 합치는 함수
function mergeProjects() {
    if (window.yawayatsProjects) allProjects.push(...window.yawayatsProjects);
    if (window.oslProjects) allProjects.push(...window.oslProjects);
    if (window.hipdProjects) allProjects.push(...window.hipdProjects);
    if (window.vroomProjects) allProjects.push(...window.vroomProjects);
    if (window.jotaProjects) allProjects.push(...window.jotaProjects);

    window.projects = allProjects;
    console.log("✅ All projects merged:", window.projects);

    generateProjectList();
}

//============================================
//프로젝트 리스트 생성 함수
function generateProjectList() {
    const projectContainer = document.getElementById("project-list");

    // 🛠️ 기존 리스트 초기화 → 중복 생성 방지
    projectContainer.innerHTML = "";

    window.projects.forEach(project => {
        const projectItem = document.createElement("div");
        projectItem.classList.add("project-item");

        projectItem.innerHTML = `
            <div class="thumbnail-container">
                <img src="${project.thumbnail}" alt="${project.title}" class="thumbnail">
            </div>
            <div class="project-info-container">
                <div class="project-info-container-top">
                   <p class="project-club">${project.club}</p>
                   <p class="author">${project.author}</p>
                </div>
                <h3 class="project-title">${project.title}</h3>
            </div>
        `;

        projectContainer.appendChild(projectItem);
    });

    setupProjectClickEvents();
}

//============================================
// 클릭 시 프로젝트 상세 정보 표시
function setupProjectClickEvents() {
    const projectItems = document.querySelectorAll(".project-item");
    const rightScrollContainer = document.querySelector(".right");
    const rightPanel = document.querySelector(".right");

    projectItems.forEach((item, index) => {
        item.addEventListener("click", function () {
            projectItems.forEach((el) => el.classList.remove("clicked-project"));
            this.classList.add("clicked-project");

            const project = window.projects[index];
            const { isMobile, isTablet } = getScreenType();

            if (project) {
                // ✅ return 버튼을 포함한 상태로 우측 패널 생성
                rightPanel.innerHTML = `
                    <div class="project-detail">
                        <div class="project-detail-info">
                            ${ (isMobile || isTablet ) ? `
                                <div class="right-return-button">
                                    <svg width="18" height="30" viewBox="0 0 18 30" fill="none">
                                        <path d="M16.667 1.66797L3.33366 15.0013L16.667 28.3346" stroke="#A9A9A9" stroke-width="3.33333"/>
                                    </svg>
                                </div>
                            ` : ""}
                            <p class="club-name">${project.club}</p>
                            <div class="project-detail-info-bottom">
                                <h2>${project.title}</h2>
                                <p class="project-author">${project.author}</p>
                            </div>
                        </div>

                        <div class="media-container">
                            ${project.media
                                ? project.media.map((item) => {
                                    if (item.endsWith(".mp4")) {
                                        return `<video class="detail-video" controls>
                                                    <source src="${item}" type="video/mp4">
                                                    Your browser does not support the video tag.
                                                </video>`;
                                    } else {
                                        return `<img src="${item}" alt="${project.title}" class="detail-image">`;
                                    }
                                }).join("")
                                : `<img src="${project.thumbnail}" alt="${project.title}" class="detail-image">`
                            }
                        </div>

                        <div class="description">
                            <p class="descText">${project.descText || "설명이 없습니다."}</p>
                            ${project.contact ? createContactSection(project.contact) : ""}
                        </div>
                    </div>
                `;

                // ✅ return 버튼 강제 추가 (혹시라도 안 붙었을 경우 대비)
                setTimeout(() => checkAndAddReturnButton(), 10);
                addReturnButtonEvent();
            }
        });
    });
}





function observeRightPanel() {
    const rightPanel = document.querySelector(".right");

    // 이미 return arrow가 있으면 중복 실행 방지
    if (document.querySelector(".right-return-button")) return;

    const observer = new MutationObserver(() => {
        if (document.querySelector(".right .project-detail-info")) {
            observer.disconnect();
            checkAndAddReturnButton(); // ✅ right 패널이 생기면 return arrow 추가
        }
    });

    observer.observe(rightPanel, { childList: true, subtree: true });
}




//============================================
//Contact 정보 정리하는 함수
function createContactSection(contact) {
    if (!contact || Object.keys(contact).length === 0) return "";

    return `
        <div class="contact-section">
            <hr class="contact-line">
            ${Object.keys(contact)
                .map((key) => {
                    const value = contact[key];
                    return `
                    <div class="contact-item">
                        <span class="contact-label"><strong>${key}</strong></span>
                        <span class="contact-divider">|</span>
                        ${value.includes("http")
                            ? `<a href="${value}" target="_blank" class="contact-value address">${value}</a>`
                            : `<span class="contact-value">${value}</span>`}
                    </div>
                `;
                })
                .join("")}
        </div>
    `;
}


//============================================
//모바일용 우측 페이지 처리

document.addEventListener("DOMContentLoaded", function () {
    const projectItems = document.querySelectorAll(".project-item");
    const rightScrollContainer = document.querySelector(".right");
    let startX = 0;
    let endX = 0;

    if (!rightScrollContainer || !projectItems.length) return;

    // 📌 프로젝트 아이템 클릭 시 right 표시
    projectItems.forEach((item) => {
        item.addEventListener("click", function () {
            rightScrollContainer.classList.add("active"); // right 등장
        });
    });

    // 📌 오른쪽으로 스와이프하면 right 닫기
    rightScrollContainer.addEventListener("touchstart", function (event) {
        startX = event.touches[0].clientX;
    });

    rightScrollContainer.addEventListener("touchmove", function (event) {
        endX = event.touches[0].clientX;
    });

    rightScrollContainer.addEventListener("touchend", function () {
        if (endX - startX > 50) { // 오른쪽으로 스와이프하면 닫기
            rightScrollContainer.classList.remove("active");
        }
    });

    // 📌 마우스 휠 스크롤 허용
    rightScrollContainer.addEventListener("wheel", function (event) {
        rightScrollContainer.scrollTop += event.deltaY;
        event.preventDefault(); // 기본 스크롤 차단 방지
    }, { passive: false });
});


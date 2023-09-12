// document.addEventListener("DOMContentLoaded", function () {
//   // 獲取所有步驟內容的容器
//   const stepContainers = document.querySelectorAll(".step-content");
//   let currentStep = 0;

//   stepContainers.forEach((container) => {
//     const prevButton = container.querySelector(".prevButton");
//     const nextButton = container.querySelector(".nextButton");
//     const fetchButton = container.querySelector(".fetch");

//     if (nextButton) {
//       nextButton.addEventListener("click", () => {
//         if (currentStep < stepContainers.length - 1) {
//           // 隐藏当前步骤
//           stepContainers[currentStep].classList.remove("active");
//           stepContainers[currentStep].classList.add("d-none");

//           // 显示下一个步骤
//           currentStep++;
//           stepContainers[currentStep].classList.remove("d-none");
//           stepContainers[currentStep].classList.add("active");

//           updateProgressBar();
//         }
//       });
//     }

//     if (prevButton) {
//       prevButton.addEventListener("click", () => {
//         if (currentStep > 0) {
//           // 隐藏当前步骤
//           stepContainers[currentStep].classList.remove("active");
//           stepContainers[currentStep].classList.add("d-none");

//           // 显示上一个步骤
//           currentStep--;
//           stepContainers[currentStep].classList.remove("d-none");
//           stepContainers[currentStep].classList.add("active");

//           updateProgressBar();
//         }
//       });
//     }

//     if (fetchButton) {
//       fetchButton.addEventListener("click", () => {
//         // 在这里执行数据传递操作，例如向服务器发送请求或处理数据

//         // 隐藏当前步骤的 fetch 按钮
//         fetchButton.classList.add("d-none");

//         // 显示下一个步骤的 nextButton
//         fetchButton
//           .closest("div.btnContain")
//           .querySelector("button.nextButton")
//           .classList.remove("d-none");
//       });
//     }
//   });

//   function updateProgressBar() {
//     stepContainers.forEach((stepContainer, stepIndex) => {
//       // 更新進度條
//       const progressBar =
//         stepContainer.parentNode.querySelector(".progressbar");
//       if (progressBar) {
//         const steps = progressBar.querySelectorAll("li");

//         // 根據當前步驟索引更新進度條
//         steps.forEach((step, index) => {
//           if (index <= currentStep) {
//             step.classList.add("active");
//           } else {
//             step.classList.remove("active");
//           }
//         });
//       }

//       // 更新步驟內容的顯示/隱藏
//       if (stepIndex === currentStep) {
//         stepContainer.classList.remove("d-none"); // 使用classList.remove隐藏
//         stepContainer.classList.add("active");
//       } else {
//         stepContainer.classList.remove("active");
//         stepContainer.classList.add("d-none"); // 使用classList.add显示
//       }
//     });
//   }

//   // 初始化頁面
//   updateProgressBar();
// });

// $("#Add_addManagerButton").on("click", () => {
//   $("#step1Content input").prop("disabled", true);
// });

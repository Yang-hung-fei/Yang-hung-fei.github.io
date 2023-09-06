document.addEventListener("DOMContentLoaded", function () {
  // 获取所有步骤内容的容器
  const stepContainers = document.querySelectorAll(".step-content");

  // 设置初始步骤为0（第一个步骤）
  let currentStep = 0;

  // 遍历每个步骤内容容器
  stepContainers.forEach((container, index) => {
    // 获取当前步骤的 "上一步" 和 "下一步" 按钮
    const prevButton = container.querySelector(".prevButton");
    const nextButton = container.querySelector(".nextButton");

    // 下一步按钮点击事件处理程序
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (currentStep < stepContainers.length - 1) {
          currentStep++;
          updateProgressBar();
        }
      });
    }

    // 上一步按钮点击事件处理程序
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        if (currentStep > 0) {
          currentStep--;
          updateProgressBar();
        }
      });
    }
  });

  // 更新进度条和步骤内容的函数
  function updateProgressBar() {
    // 遍历每个步骤内容容器
    stepContainers.forEach((stepContainer, stepIndex) => {
      // 更新进度条
      const progressBar =
        stepContainer.parentNode.querySelector(".progressbar");
      if (progressBar) {
        const steps = progressBar.querySelectorAll("li");

        // 根据当前步骤索引更新进度条
        steps.forEach((step, index) => {
          if (index <= currentStep) {
            step.classList.add("active");
          } else {
            step.classList.remove("active");
          }
        });
      }

      // 更新步骤内容的显示/隐藏
      if (stepIndex === currentStep) {
        stepContainer.classList.remove("hidden");
        stepContainer.classList.add("active");
      } else {
        stepContainer.classList.remove("active");
        stepContainer.classList.add("hidden");
      }
    });
  }

  // 初始化页面
  updateProgressBar();
});

import Link from "next/link";

import {
  regularEnglishCategories,
  getRegularEnglishQuestionsByCategorySlug,
} from "@/lib/regular-english-questions";

const categoryEnglishTitles: Record<string, string> = {
  "自我介绍": "Self-Introduction",
  "家庭朋友": "Family and Friends",
  "学校生活": "School Life",
  "专业学习": "Major and Studies",
  "兴趣爱好": "Hobbies and Interests",
  "旅游经历": "Travel Experiences",
  "食物与健康": "Food and Health",
  "科技与AI": "Technology and AI",
  "环境保护": "Environmental Protection",
  "社交媒体": "Social Media",
  "未来职业规划": "Future Career Plans",
  "校园活动": "Campus Activities",
  "图书馆 / 宿舍 / 课堂": "Library, Dormitory and Classroom",
  "团队合作": "Teamwork",
  "压力与时间管理": "Stress and Time Management",
  "电影与电视剧": "Films and TV Series",
  "音乐与艺术": "Music and Art",
  "阅读与书籍": "Reading and Books",
  "网络学习与在线课程": "Online Learning and Courses",
  "手机与数字生活": "Mobile Phones and Digital Life",
  "节日与传统文化": "Festivals and Traditional Culture",
  "兼职与社会实践": "Part-Time Jobs and Social Practice",
  "公共交通与城市生活": "Public Transport and City Life",
  "志愿服务与帮助他人": "Volunteering and Helping Others",
  "健身与运动": "Fitness and Sports",
  "消费与理财": "Consumption and Money Management",
  "社会责任与公民意识": "Social Responsibility and Civic Awareness",
  "交流能力与沟通技巧": "Communication Skills",
  "幸福感与生活质量": "Happiness and Quality of Life",
  "梦想与个人成长": "Dreams and Personal Growth",
  "网络购物": "Online Shopping",
  "语言学习": "Language Learning",
  "宠物与动物": "Pets and Animals",
  "天气与气候": "Weather and Climate",
  "自律与习惯养成": "Self-Discipline and Habits",
  "偶像与榜样": "Role Models and Idols",
  "创新与创造力": "Innovation and Creativity",
  "规则与自由": "Rules and Freedom",
  "人工智能伦理": "AI Ethics",
  "校园安全": "Campus Safety",
  "时间的价值": "The Value of Time",
  "失败与挫折": "Failure and Setbacks",
  "自信与心理成长": "Confidence and Mental Growth",
  "学习方法与效率": "Study Methods and Efficiency",
  "人与自然的关系": "Humans and Nature",
};

function formatTopicNumber(slug: string) {
  return slug.replace("category-", "").padStart(2, "0");
}

export function RegularEnglishLibrary() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1480px] flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <section className="mx-auto flex w-full max-w-[1380px] flex-col">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d7557]">Regular English Practice</p>
          <h1 className="text-3xl font-semibold tracking-[-0.06em] text-[#101828] sm:text-5xl lg:text-[4.8rem]">
            口语素养题库
          </h1>
          <p className="mx-auto max-w-4xl text-sm leading-7 text-[#5b5349] sm:text-base sm:leading-8">
            选择一个主题进入练习。进入分类后可以按题开始录音，也可以随机抽取当前主题中的题目进行训练。
          </p>
        </div>

        <div className="mt-8 flex justify-center sm:mt-10">
          <Link href="/regular-english/category-01" className="brand-button sm:min-w-[220px]">
            从第一个分类开始
          </Link>
        </div>
      </section>

      <section className="mt-12 sm:mt-16">
        <div className="grid gap-0 border-t border-black/8">
          {regularEnglishCategories.map((category) => {
            const questions = getRegularEnglishQuestionsByCategorySlug(category.slug);
            const previewLines = questions.slice(0, 4).map((question) => question.prompt);

            return (
              <Link
                key={category.id}
                href={`/regular-english/${category.slug}`}
                className="grid gap-3 border-b border-black/8 py-5 transition hover:bg-black/[0.015] sm:py-6 md:grid-cols-[120px_1fr_180px] lg:grid-cols-[140px_1fr_220px]"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#9f968b]">
                  <span>{`Topic ${formatTopicNumber(category.slug)}`}</span>
                  <span className="text-xs text-[#b4aca1] md:hidden">{`${category.questionCount} 道题`}</span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-wrap items-end gap-3">
                      <h3 className="text-xl font-medium tracking-[-0.03em] text-[#101828] sm:text-2xl">
                        {categoryEnglishTitles[category.title] ?? category.title}
                      </h3>
                      <p className="text-sm text-[#8d7557] sm:text-base">{category.title}</p>
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    {previewLines.map((item, index) => (
                      <p key={`${category.id}-${index}`} className="text-sm leading-6 text-[#5b5349] sm:leading-7">
                        {index + 1}. {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="hidden text-sm text-[#9f968b] md:block md:text-right">
                  <div>{`${category.questionCount} 道题`}</div>
                  <div className="mt-2">先试一题，看看你能说到什么程度</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

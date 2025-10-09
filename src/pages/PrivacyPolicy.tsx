import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Mail, Shield, Lock, Users } from "lucide-react";

const PrivacyPolicy = () => {
  const handleFormTrigger = (type: 'demo' | 'free_trial') => {
    // Esta función no es necesaria para la página de políticas de privacidad
    // pero se requiere para el componente Header
    console.log('Form trigger:', type);
  };
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    introduction: true,
    dataProtection: true,
    informationCollected: true,
    personalInformation: true,
    legalBasis: true,
    informationUsage: true,
    sharingInformation: true,
    cookies: true,
    globalPractices: true,
    dataRetention: true,
    contact: true,
    changes: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: "introduction",
      title: "Introducción",
      icon: Shield,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            Esta política de privacidad ("Política de Privacidad") se aplica a todos los visitantes y usuarios de los servicios y sitios web alojados en KLYWO.com (en conjunto, el "Sitio Web" o los "Sitios Web") y de las instalaciones autogestionadas, ofrecidos por KLYWO Inc. y/o cualquiera de sus afiliados ("KLYWO" o "nosotros").
          </p>
          <p>
            Lea atentamente esta Política de Privacidad. Al acceder o utilizar cualquier parte de los Sitios Web o las instalaciones autogestionadas, usted reconoce haber sido informado y consiente nuestras prácticas con respecto a su información y datos personales.
          </p>
        </div>
      )
    },
    {
      id: "dataProtection",
      title: "Protección de datos",
      icon: Lock,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            La supervisión de la seguridad de los datos está a cargo de los respectivos responsables de protección de datos de KLYWO. Si desea modificar, eliminar o añadir datos personales que considere recopilados por KLYWO, o si tiene alguna duda sobre seguridad, póngase en contacto con nosotros en <a href="mailto:privacy@KLYWO.com" className="text-brand-primary hover:underline">privacy@KLYWO.com</a>.
          </p>
          <p>
            Para obtener más información sobre nuestras prácticas de seguridad, visite este enlace.
          </p>
        </div>
      )
    },
    {
      id: "informationCollected",
      title: "Qué información recopila KLYWO y por qué",
      icon: Users,
      content: (
        <div className="space-y-6 text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Información de los visitantes del sitio web</h4>
            <p>
              Como la mayoría de los operadores de sitios web, KLYWO recopila información básica que podría identificar personalmente a los visitantes del sitio web, similar a la que suelen ofrecer los navegadores y servidores web, como el tipo de navegador, el idioma de preferencia, el sitio de referencia y la fecha y hora de cada solicitud. Recopilamos esta información para comprender mejor cómo los visitantes usan el sitio web, para mejorar nuestro sitio web y la experiencia de nuestros visitantes, y para supervisar la seguridad del sitio web.
            </p>
            <p className="mt-3">
              Ocasionalmente, KLYWO puede divulgar información que podría identificar personalmente a los visitantes del sitio web en conjunto, por ejemplo, mediante la publicación de un informe sobre las tendencias de uso del sitio web.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Información de datos de uso de instancias de KLYWO autogestionadas</h4>
            <p>
              KLYWO recopila información sobre el uso de cada instancia de KLYWO autogestionada (Edición Community y Edición Enterprise). No rastreamos a sus usuarios finales, sino el uso de estas instancias a nivel agregado. También es posible desactivar el envío de esta información mediante el interruptor de entorno en la aplicación.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "personalInformation",
      title: "Información de identificación personal",
      icon: Users,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            Los usuarios de los Sitios Web pueden interactuar con KLYWO de maneras que nos proporcionen su información personal. En algunos casos, se genera un ID de Usuario para el seguimiento de formularios y URL, visitas a páginas, pings y recuentos de uso, con el fin de determinar el rendimiento y el desarrollo del producto. La cantidad y el tipo de información que KLYWO recopila dependen de la naturaleza de su interacción con nosotros, así como de la cantidad de información que decida compartir.
          </p>
          <p>
            Por ejemplo, solicitamos a los visitantes que usan nuestro widget de chat en vivo que proporcionen su nombre completo y dirección de correo electrónico. También recopilaremos la información que nos proporcione al crear una cuenta en el Sitio Web.
          </p>
          <p>
            Si informa a KLYWO sobre una vulnerabilidad de seguridad y solicita su reconocimiento público, podremos divulgar públicamente la información personal que nos proporcionó en relación con el informe, incluido su nombre, para cumplir con su solicitud.
          </p>
        </div>
      )
    },
    {
      id: "legalBasis",
      title: "Base para el procesamiento de su información",
      icon: Shield,
      content: (
        <div className="space-y-6 text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Ejecución de un contrato</h4>
            <p>
              El uso de su información puede ser necesario para ejecutar el contrato que tiene con nosotros. Por ejemplo, si utiliza nuestros sitios web para adquirir suscripciones a productos o servicios de KLYWO, contribuir a un proyecto, crear un perfil, publicar y comentar en nuestros sitios web o solicitar información a través de ellos, utilizaremos su información para cumplir con nuestra obligación de completar y administrar dicho contrato o solicitud.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Intereses legítimos</h4>
            <p>
              Utilizamos su información para nuestros intereses legítimos, como brindarle el mejor contenido a través de nuestros sitios web y comunicaciones con los usuarios y el público, para mejorar y promover nuestros productos y servicios, y para fines administrativos, de seguridad, prevención de fraude y legales.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Consentimiento</h4>
            <p>
              Podemos basarnos en su consentimiento para utilizar su información personal con fines de marketing directo, como enviarle boletines informativos sobre los productos de KLYWO. Puede retirar su consentimiento en cualquier momento mediante la función de cancelación de suscripción que se incluye en cada correo electrónico de marketing o poniéndose en contacto con nosotros en las direcciones que figuran al final de esta Política de Privacidad.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "informationUsage",
      title: "Cómo KLYWO utiliza y protege la información de identificación personal",
      icon: Shield,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            KLYWO solo divulga información potencialmente identificable y de identificación personal a aquellos empleados, contratistas y organizaciones afiliadas que (i) necesitan conocer dicha información para procesarla en nombre de KLYWO o para proporcionar servicios disponibles en el sitio web, y (ii) que han acordado no divulgarla a otros.
          </p>
          <p>
            KLYWO no alquilará ni venderá información que pueda identificar a nadie. Salvo a sus empleados, contratistas y organizaciones afiliadas, como se describe anteriormente, KLYWO divulga información que pueda identificar a alguien y que pueda identificar a alguien solo cuando lo exija la ley o cuando considere de buena fe que dicha divulgación es razonablemente necesaria para proteger la propiedad o los derechos de KLYWO, de terceros o del público en general.
          </p>
          <p>
            KLYWO toma las medidas razonablemente necesarias para proteger contra el acceso, uso, alteración o destrucción no autorizados de información potencialmente identificable. Estas medidas incluyen el cifrado de datos en tránsito y en reposo, controles de acceso, revisiones periódicas de seguridad y la monitorización de nuestros sistemas para detectar posibles vulnerabilidades y ataques.
          </p>
        </div>
      )
    },
    {
      id: "sharingInformation",
      title: "Compartir su información",
      icon: Users,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            Tenga en cuenta que las direcciones de correo electrónico y IP de los usuarios de una implementación de KLYWO pueden compartirse con los respectivos usuarios de esa implementación.
          </p>
          <p>
            KLYWO, a su entera discreción, podrá utilizar los logotipos de las empresas que utilicen el software que proporcionamos. Si tiene alguna duda sobre el uso de su logotipo, envíe un correo electrónico a <a href="mailto:hello@KLYWO.com" className="text-brand-primary hover:underline">hello@KLYWO.com</a>.
          </p>
        </div>
      )
    },
    {
      id: "cookies",
      title: "Cookies, tecnologías de seguimiento y no rastrear",
      icon: Shield,
      content: (
        <div className="space-y-6 text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Cookies</h4>
            <p>
              Una cookie es una cadena de información que un sitio web almacena en el ordenador del visitante y que su navegador proporciona al sitio web cada vez que regresa. KLYWO utiliza cookies para identificar y rastrear a los visitantes, su uso de los sitios web y sus preferencias de acceso. Los visitantes de KLYWO que no deseen que se instalen cookies en sus ordenadores pueden configurar sus navegadores para que las rechacen antes de usar los sitios web. Deshabilitar las cookies del navegador puede provocar que ciertas funciones de los sitios web de KLYWO no funcionen correctamente.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Tecnologías de seguimiento</h4>
            <p>
              Podemos utilizar servicios de seguimiento de terceros, pero no los utilizamos para rastrearlo individualmente ni para recopilar información personal. Podemos utilizar estos servicios para recopilar información sobre el rendimiento del sitio web y cómo los usuarios navegan y lo utilizan, para poder supervisar y mejorar nuestro contenido y el rendimiento del sitio web.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">No rastrear</h4>
            <p>
              "No rastrear" es una preferencia de privacidad que puede configurar en su navegador si no desea que los servicios en línea recopilen y compartan cierta información sobre su actividad en línea a través de servicios de seguimiento de terceros. KLYWO no rastrea su actividad de navegación en otros servicios en línea a lo largo del tiempo, y no permitimos que servicios de terceros rastreen su actividad en nuestro sitio más allá de nuestro seguimiento básico, del cual puede optar por no participar.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "globalPractices",
      title: "Prácticas globales de privacidad",
      icon: Shield,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            La información que recopilamos se almacenará y procesará en Estados Unidos de acuerdo con esta Política de Privacidad. Sin embargo, entendemos que los usuarios de otros países pueden tener diferentes expectativas y derechos sobre su privacidad. Para todos los visitantes y usuarios del sitio web, independientemente de su país de residencia, haremos lo siguiente:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>proporcionar métodos claros de consentimiento informado e inequívoco cuando recopilemos su información personal;</li>
            <li>recopilar únicamente la cantidad mínima de datos personales necesarios para el propósito para el que se recopilan, a menos que elija proporcionarnos más;</li>
            <li>ofrecerle métodos simples para acceder, corregir o eliminar su información que hemos recopilado, excepto la información que usted proporciona voluntariamente y que es necesaria conservar tal como está para la integridad de nuestro código de proyecto;</li>
            <li>Brindamos a los usuarios del sitio web información, opciones, responsabilidad, seguridad y acceso, y limitamos la finalidad del procesamiento. También ofrecemos a nuestros usuarios un método de recurso y cumplimiento.</li>
          </ul>
          <p>
            Si se encuentra en la Unión Europea, tiene derecho a los siguientes derechos sobre su información y datos personales:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Derecho de acceso a sus datos personales, para saber qué información sobre usted tenemos.</li>
            <li>Derecho a corregir cualquier dato personal incorrecto o incompleto sobre usted que tengamos.</li>
            <li>Derecho a restringir o suspender nuestro procesamiento de sus datos personales.</li>
            <li>Derecho a presentar una reclamación ante una autoridad de control si considera que se están violando sus derechos de privacidad.</li>
          </ul>
        </div>
      )
    },
    {
      id: "dataRetention",
      title: "Retención y eliminación de datos",
      icon: Lock,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            Si ya tiene una cuenta en los Sitios web, puede acceder, actualizar, modificar o eliminar la información básica de su perfil de usuario iniciando sesión en su cuenta y actualizando la configuración del perfil.
          </p>
          <p>
            KLYWO retendrá su información mientras su cuenta esté activa o según sea necesario para cumplir con nuestras obligaciones contractuales, brindarle servicios a través del sitio web, cumplir con obligaciones legales, resolver disputas, preservar derechos legales o hacer cumplir nuestros acuerdos.
          </p>
          <p>
            Tenga en cuenta que, debido a la naturaleza de código abierto de nuestros productos, servicios y comunidad, podemos conservar información personal identificable limitada indefinidamente para garantizar la integridad transaccional y el no repudio.
          </p>
        </div>
      )
    },
    {
      id: "contact",
      title: "Cómo contactar con KLYWO sobre su privacidad",
      icon: Mail,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            Si tiene alguna pregunta o inquietud sobre cómo manejamos su información, o si desea ejercer sus derechos de privacidad, envíenos un correo electrónico con el asunto "Inquietud de Privacidad" a <a href="mailto:privacy@KLYWO.com" className="text-brand-primary hover:underline">privacy@KLYWO.com</a>.
          </p>
          <p>
            Le responderemos en un plazo máximo de 30 días tras recibir su mensaje, pero tenga en cuenta que, para una respuesta más rápida, le recomendamos que nos envíe un correo electrónico.
          </p>
        </div>
      )
    },
    {
      id: "changes",
      title: "Cambios en la política de privacidad",
      icon: Shield,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            Aunque es probable que la mayoría de los cambios sean menores, KLYWO puede modificar su política de privacidad ocasionalmente, a su entera discreción. También podemos notificar a los usuarios que nos hayan proporcionado direcciones de correo electrónico sobre cambios sustanciales en esta Política de Privacidad a través de nuestro sitio web.
          </p>
          <p>
            KLYWO recomienda a los visitantes que revisen esta página con frecuencia para estar al tanto de cualquier cambio menor en su Política de Privacidad. Su uso continuado de este sitio después de cualquier cambio en esta Política de Privacidad constituirá su aceptación de dicho cambio.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header onFormTrigger={handleFormTrigger} />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprometidos con la protección de su información personal y la transparencia en nuestras prácticas de datos.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contenido</h2>
              <nav className="space-y-2">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className="w-full text-left flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-sm text-gray-700">
                      {index + 1}. {section.title}
                    </span>
                    {expandedSections[section.id] ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
              {sections.map((section) => (
                <div key={section.id} className="mb-8 last:mb-0">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center space-x-3">
                      <section.icon className="h-6 w-6 text-brand-primary" />
                      <h2 className="text-2xl font-bold text-gray-900 group-hover:text-brand-primary transition-colors duration-200">
                        {section.title}
                      </h2>
                    </div>
                    {expandedSections[section.id] ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedSections[section.id] && (
                    <div className="mt-6 pl-9">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-8 border border-blue-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">¿Tiene preguntas sobre nuestra política de privacidad?</h3>
                <p className="mb-6 text-gray-700">
                    Nuestro equipo de privacidad está aquí para ayudarle con cualquier consulta que pueda tener.
                </p>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <a href="mailto:privacy@KLYWO.com" className="text-white hover:text-white">
                    <Mail className="h-5 w-5 mr-2" />
                    Contactar con Privacidad
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;